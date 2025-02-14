-- CreateTable
CREATE TABLE "TaskEvaluation" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "effect" TEXT,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "impact" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskEvaluationTag" (
    "id" SERIAL NOT NULL,
    "taskEvaluationId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskEvaluationTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationTag" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "EvaluationTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationTag_key_key" ON "EvaluationTag"("key");

-- AddForeignKey
ALTER TABLE "TaskEvaluation" ADD CONSTRAINT "TaskEvaluation_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskEvaluation" ADD CONSTRAINT "TaskEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskEvaluationTag" ADD CONSTRAINT "TaskEvaluationTag_taskEvaluationId_fkey" FOREIGN KEY ("taskEvaluationId") REFERENCES "TaskEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskEvaluationTag" ADD CONSTRAINT "TaskEvaluationTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "EvaluationTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
