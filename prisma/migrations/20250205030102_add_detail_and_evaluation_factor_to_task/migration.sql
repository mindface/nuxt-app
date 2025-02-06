-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "detail" TEXT,
ADD COLUMN     "evaluationFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.0;
