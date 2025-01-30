/*
  Warnings:

  - You are about to drop the column `ticket_code` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "ticket_code",
ADD COLUMN     "ticket_status" TEXT NOT NULL DEFAULT 'pending';
