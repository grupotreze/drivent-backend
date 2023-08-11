import { ApplicationError } from "@/protocols";

export function notFoundError(message = "No result for this search!"): ApplicationError {
  return {
    name: "NotFoundError",
    message,
  };
}
