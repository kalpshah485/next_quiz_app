-- CreateTable
CREATE TABLE "results" (
    "quiz_id" SERIAL NOT NULL,
    "email_id" TEXT NOT NULL,
    "questions" JSON NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "results_email_id_key" ON "results"("email_id");
