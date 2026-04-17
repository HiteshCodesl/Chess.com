/*
  Warnings:

  - Made the column `fen` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "fen" SET NOT NULL;
