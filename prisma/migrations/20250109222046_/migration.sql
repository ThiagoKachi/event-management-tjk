/*
  Warnings:

  - Changed the type of `available` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "available",
ADD COLUMN     "available" INTEGER NOT NULL;
