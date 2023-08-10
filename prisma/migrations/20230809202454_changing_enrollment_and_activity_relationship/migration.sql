/*
  Warnings:

  - You are about to drop the column `activityId` on the `Enrollment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_activityId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "activityId";

-- CreateTable
CREATE TABLE "_ActivityToEnrollment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToEnrollment_AB_unique" ON "_ActivityToEnrollment"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToEnrollment_B_index" ON "_ActivityToEnrollment"("B");

-- AddForeignKey
ALTER TABLE "_ActivityToEnrollment" ADD CONSTRAINT "_ActivityToEnrollment_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToEnrollment" ADD CONSTRAINT "_ActivityToEnrollment_B_fkey" FOREIGN KEY ("B") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
