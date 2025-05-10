/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,userId]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RainType" AS ENUM ('GAME', 'CHAT', 'MANUAL');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropIndex
DROP INDEX "chatrooms_gameSessionId_key";

-- CreateIndex
CREATE UNIQUE INDEX "members_organizationId_userId_key" ON "members"("organizationId", "userId");
