/*
  Warnings:

  - You are about to drop the column `playerRating` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "playerRating";

-- CreateTable
CREATE TABLE "TournamentRating" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "TournamentRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TournamentRating" ADD CONSTRAINT "TournamentRating_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRating" ADD CONSTRAINT "TournamentRating_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
