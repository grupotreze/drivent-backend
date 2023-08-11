import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "./errors";
import axios from "axios";
import dotenv from "dotenv";
import qs from "query-string";
import userService from "../users-service";
import { v4 as uuid } from "uuid";

dotenv.config();

type GitHubParamsForAccessToken = {
  code: string;
  grant_type: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
};

async function oauthLogin(code: string) {
  const GITHUB_ACESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
  const params: GitHubParamsForAccessToken = {
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  
  const { data } = await axios.post(GITHUB_ACESS_TOKEN_URL, params, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  const { access_token } = qs.parse(data);
  const token = Array.isArray(access_token) ? access_token.join("") : access_token;

  const GITHUB_USEREMAIL= "https://api.github.com/user/emails";
  const responseEmail = await axios.get(GITHUB_USEREMAIL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const GITHUB_NAME= "https://api.github.com/user";
  const responseName = await axios.get(GITHUB_NAME, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const emailExists = await userService.verifyUniqueEmail(responseEmail.data[0].email);
  
  if (emailExists) {
    const user = await getUserOrFail(responseEmail.data[0].email);
    const tokenJWT = await createSession(user.id);
    return {
      user: exclude(user, "password"),
      token: tokenJWT,
      name: responseName.data.name
    };
  } else {
    const createUser = await userService.createUser({ email: responseEmail.data[0].email, password: String(uuid()) });
    
    const user = await getUserOrFail(createUser.email);
    const tokenJWT = await createSession(user.id);
    return {    
      user: { id: user.id, email: user.email },
      token: tokenJWT,
      name: responseName.data.name
    };
  }
}

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;
  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);
    
  return {
    user: exclude(user, "password"),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

const authenticationService = {
  signIn, oauthLogin
};

export default authenticationService;
export * from "./errors";
