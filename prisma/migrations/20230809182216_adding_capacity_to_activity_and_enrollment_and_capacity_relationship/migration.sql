-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "activityId" INTEGER;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
