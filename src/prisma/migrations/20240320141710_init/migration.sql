/*
  Warnings:

  - Made the column `score` on table `results` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "results" ALTER COLUMN "score" SET NOT NULL;
