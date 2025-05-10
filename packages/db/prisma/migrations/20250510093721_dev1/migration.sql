-- CreateEnum
CREATE TYPE "ChatChannel" AS ENUM ('LOBBY', 'GAME', 'TOURNAMENT', 'PRIVATE');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('BOY', 'GIRL', 'ALIEN', 'UNSURE', 'ROBOT', 'COMPLICATED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'FRIEND_REQUEST', 'ACHIEVEMENT', 'BALANCE_UPDATE', 'PROMOTIONAL', 'TOURNAMENT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'BET', 'WIN', 'BONUS', 'DONATION', 'ADJUSTMENT', 'TOURNAMENT_BUYIN', 'TOURNAMENT_PRIZE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "GameCategory" AS ENUM ('TABLE', 'FISH', 'POKER', 'SLOTS', 'OTHER');

-- CreateEnum
CREATE TYPE "key_mode" AS ENUM ('read', 'write', 'all', 'upload');

-- CreateEnum
CREATE TYPE "message_state" AS ENUM ('read', 'unread', 'group');

-- CreateEnum
CREATE TYPE "platform_os" AS ENUM ('ios', 'android');

-- CreateEnum
CREATE TYPE "product_cost" AS ENUM ('D500', 'D1000', 'D2000', 'D5000', 'D10000');

-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('PENDING', 'SUCCESS', 'ERROR');

-- CreateEnum
CREATE TYPE "stripe_status" AS ENUM ('created', 'succeeded', 'updated', 'failed', 'deleted', 'canceled');

-- CreateEnum
CREATE TYPE "transaction_status" AS ENUM ('PENDING', 'COMPLETED', 'DENIED');

-- CreateEnum
CREATE TYPE "usage_mode" AS ENUM ('last_saved', 'min5', '"day"', '"cycle"');

-- CreateEnum
CREATE TYPE "user_min_right" AS ENUM ('read', 'upload', 'write', 'admin');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('read', 'upload', 'write', 'admin');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ONLINE', 'OFFLINE', 'BUSY', 'AWAY');

-- CreateEnum
CREATE TYPE "volatility" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetXp" INTEGER NOT NULL,
    "reward" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "sbId" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN,
    "isOnline" BOOLEAN,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN,
    "role" TEXT,
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "username" TEXT NOT NULL,
    "displayUsername" TEXT NOT NULL DEFAULT '',
    "passwordHash" TEXT,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "verificationToken" TEXT,
    "avatar" TEXT,
    "activeProfileId" TEXT,
    "gender" "Gender",
    "status" "UserStatus",
    "cashtag" TEXT,
    "phpId" INTEGER,
    "accessToken" TEXT,
    "vipInfoId" TEXT,
    "lastDailySpin" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeGameId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshToken" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "platform_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operators" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "acceptedPayments" TEXT[] DEFAULT ARRAY['CASHAPP']::TEXT[],
    "ownerId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "authorId" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastPlayed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "phpId" INTEGER,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "shopId" TEXT NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "temperature" TEXT,
    "developer" TEXT,
    "vipLevel" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT false,
    "device" INTEGER DEFAULT 0,
    "featured" BOOLEAN DEFAULT false,
    "gamebank" TEXT DEFAULT 'slots',
    "bet" DOUBLE PRECISION DEFAULT 0,
    "denomination" DOUBLE PRECISION DEFAULT 0,
    "categoryTemp" DOUBLE PRECISION DEFAULT 0,
    "originalId" INTEGER DEFAULT 0,
    "bids" INTEGER DEFAULT 0,
    "statIn" DOUBLE PRECISION DEFAULT 0,
    "statOut" DOUBLE PRECISION DEFAULT 0,
    "currentRtp" DOUBLE PRECISION DEFAULT 0,
    "rtpStatIn" DOUBLE PRECISION DEFAULT 0,
    "rtpStatOut" DOUBLE PRECISION DEFAULT 0,
    "standardRtp" DOUBLE PRECISION DEFAULT 0,
    "popularity" DOUBLE PRECISION DEFAULT 0,
    "chanceFirepot1" DOUBLE PRECISION,
    "chanceFirepot2" DOUBLE PRECISION,
    "chanceFirepot3" DOUBLE PRECISION,
    "fireCount1" DOUBLE PRECISION,
    "fireCount2" DOUBLE PRECISION,
    "fireCount3" DOUBLE PRECISION,
    "linesPercentConfigSpin" TEXT,
    "linesPercentConfigSpinBonus" TEXT,
    "linesPercentConfigBonus" TEXT,
    "linesPercentConfigBonusBonus" TEXT,
    "rezerv" DOUBLE PRECISION DEFAULT 0,
    "cask" DOUBLE PRECISION DEFAULT 0,
    "advanced" TEXT DEFAULT '',
    "scaleMode" TEXT NOT NULL DEFAULT '',
    "slotViewState" TEXT NOT NULL DEFAULT '',
    "view" INTEGER DEFAULT 0,
    "categoryId" TEXT,
    "operatorId" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "jackpotGroupId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,
    "category" "GameCategory" NOT NULL DEFAULT 'SLOTS',

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operatorgames" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "minBet" INTEGER,
    "maxBet" INTEGER,
    "xpMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "operatorId" TEXT NOT NULL,

    CONSTRAINT "operatorgames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "inviterId" TEXT NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twoFactors" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "twoFactors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatmessages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "channel" "ChatChannel" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "roomId" TEXT,

    CONSTRAINT "chatmessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatrooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isGameRoom" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameSessionId" TEXT,

    CONSTRAINT "chatrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamesessions" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "betAmount" INTEGER,
    "winAmount" INTEGER,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "gameId" TEXT NOT NULL,
    "tournamentId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,
    "vipInfoId" TEXT,

    CONSTRAINT "gamesessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'default',
    "description" TEXT NOT NULL DEFAULT 'default',
    "url" TEXT NOT NULL DEFAULT 'default',
    "type" TEXT NOT NULL DEFAULT 'bundle',
    "bonusCode" TEXT DEFAULT '',
    "bonusTotalInCredits" INTEGER NOT NULL DEFAULT 0,
    "priceInCents" INTEGER NOT NULL DEFAULT 0,
    "amountToReceiveInCredits" INTEGER NOT NULL DEFAULT 0,
    "bestValue" INTEGER NOT NULL DEFAULT 0,
    "discountInCents" INTEGER NOT NULL DEFAULT 0,
    "bonusSpins" INTEGER NOT NULL DEFAULT 0,
    "isPromo" BOOLEAN DEFAULT false,
    "totalDiscountInCents" INTEGER NOT NULL DEFAULT 0,
    "shopId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "entryFee" INTEGER,
    "prizePool" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "operatorId" TEXT NOT NULL,
    "leaderboard" JSONB,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournamententries" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "wagered" INTEGER NOT NULL DEFAULT 0,
    "won" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "tournamententries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournamentgames" (
    "id" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "tournamentId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "tournamentgames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'DEPOSIT',
    "amount" INTEGER NOT NULL DEFAULT 0,
    "amountCredits" INTEGER NOT NULL DEFAULT 0,
    "buyerCashtag" TEXT,
    "buyerUserId" TEXT,
    "username" TEXT,
    "cashiername" TEXT,
    "cashierAvatar" TEXT,
    "cashierId" TEXT,
    "reference" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "isRealMoney" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT,
    "paymentDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "gameSessionId" TEXT,
    "profileId" TEXT,
    "cashtag" TEXT,
    "productid" TEXT,
    "vipInfoId" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userachievements" (
    "id" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,

    CONSTRAINT "userachievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rainbets" (
    "id" TEXT NOT NULL,
    "rainHistoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "betAmount" INTEGER NOT NULL,
    "odds" INTEGER NOT NULL,
    "outcome" TEXT,
    "settledAt" TIMESTAMP(3),

    CONSTRAINT "rainbets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rainhistories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "rainType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rainhistories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raintips" (
    "id" TEXT NOT NULL,
    "rainHistoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipAmount" INTEGER NOT NULL,
    "tippedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raintips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rainwinners" (
    "id" TEXT NOT NULL,
    "rainHistoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wonAmount" INTEGER NOT NULL,
    "wonAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rainwinners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vip_infos" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "deposit_exp" INTEGER NOT NULL DEFAULT 0,
    "bet_exp" INTEGER NOT NULL DEFAULT 0,
    "rank_bet_exp" INTEGER NOT NULL DEFAULT 0,
    "rank_deposit_exp" INTEGER NOT NULL DEFAULT 0,
    "rank_name" TEXT,
    "icon" TEXT,
    "exp_switch_type" INTEGER DEFAULT 0,
    "now_deposit_exp" TEXT,
    "level_deposit_exp" TEXT,
    "now_bet_exp" TEXT,
    "level_bet_exp" TEXT,
    "telegram" TEXT,
    "is_protection" BOOLEAN NOT NULL DEFAULT false,
    "protection_deposit_exp" TEXT,
    "protection_deposit_amount" TEXT,
    "protection_bet_exp" TEXT,
    "protection_bet_amount" TEXT,
    "protection_days" INTEGER DEFAULT 0,
    "protection_switch" INTEGER DEFAULT 0,
    "cycle_award_switch" BOOLEAN NOT NULL DEFAULT false,
    "level_award_switch" BOOLEAN NOT NULL DEFAULT false,
    "signin_award_switch" BOOLEAN NOT NULL DEFAULT false,
    "bet_award_switch" BOOLEAN NOT NULL DEFAULT false,
    "withdrawal_award_switch" BOOLEAN NOT NULL DEFAULT false,
    "unprotection_deposit_exp" TEXT,
    "unprotection_deposit_amount" TEXT,
    "unprotection_bet_exp" TEXT,
    "unprotection_bet_amount" TEXT,
    "unprotection_days" INTEGER DEFAULT 0,
    "unprotection_switch" INTEGER DEFAULT 0,
    "main_currency" TEXT,
    "can_receive_level_award" BOOLEAN NOT NULL DEFAULT false,
    "can_receive_rank_award" BOOLEAN NOT NULL DEFAULT false,
    "can_receive_day_award" BOOLEAN NOT NULL DEFAULT false,
    "can_receive_week_award" BOOLEAN NOT NULL DEFAULT false,
    "can_receive_month_award" BOOLEAN NOT NULL DEFAULT false,
    "can_receive_signin_award" BOOLEAN NOT NULL DEFAULT false,
    "can_receive_bet_award" BOOLEAN NOT NULL DEFAULT false,
    "can_receive_withdrawal_award" BOOLEAN NOT NULL DEFAULT false,
    "userid" TEXT,
    "free_spin_times" INTEGER DEFAULT 0,
    "week_gift" INTEGER DEFAULT 0,
    "month_gift" INTEGER DEFAULT 0,
    "upgrade_gift" INTEGER DEFAULT 0,
    "now_cash_back" INTEGER DEFAULT 0,
    "yesterday_cash_back" INTEGER DEFAULT 0,
    "history_cash_back" INTEGER DEFAULT 0,
    "operatorId" TEXT,

    CONSTRAINT "vip_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_logs" (
    "id" BIGSERIAL NOT NULL,
    "table_name" VARCHAR(255) NOT NULL,
    "row_id" VARCHAR(255),
    "operation" VARCHAR(10) NOT NULL,
    "payload" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_activeProfileId_key" ON "user"("activeProfileId");

-- CreateIndex
CREATE INDEX "user_created_at_idx" ON "user"("createdAt");

-- CreateIndex
CREATE INDEX "user_username_email_idx" ON "user"("username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "platform_sessions_refreshToken_key" ON "platform_sessions"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "platform_sessions_token_key" ON "platform_sessions"("token");

-- CreateIndex
CREATE INDEX "platform_sessions_refreshToken_idx" ON "platform_sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "platform_sessions_userId_idx" ON "platform_sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "operators_slug_key" ON "operators"("slug");

-- CreateIndex
CREATE INDEX "operators_slug_idx" ON "operators"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_phpId_key" ON "profiles"("phpId");

-- CreateIndex
CREATE INDEX "operator_active_profile_idx" ON "profiles"("shopId", "isActive");

-- CreateIndex
CREATE INDEX "user_active_profile_idx" ON "profiles"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_shopId_key" ON "profiles"("userId", "shopId");

-- CreateIndex
CREATE UNIQUE INDEX "operatorgames_slug_key" ON "operatorgames"("slug");

-- CreateIndex
CREATE INDEX "game_slug_idx" ON "operatorgames"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "twoFactors_userId_key" ON "twoFactors"("userId");

-- CreateIndex
CREATE INDEX "chat_channel_idx" ON "chatmessages"("channel");

-- CreateIndex
CREATE INDEX "chat_room_idx" ON "chatmessages"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "chatrooms_gameSessionId_key" ON "chatrooms"("gameSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_userId_friendId_key" ON "friendships"("userId", "friendId");

-- CreateIndex
CREATE INDEX "session_game_idx" ON "gamesessions"("gameId");

-- CreateIndex
CREATE INDEX "session_profile_idx" ON "gamesessions"("profileId");

-- CreateIndex
CREATE INDEX "notification_user_status_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "tournament_operator_idx" ON "tournaments"("operatorId");

-- CreateIndex
CREATE UNIQUE INDEX "tournamententries_userId_tournamentId_key" ON "tournamententries"("userId", "tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "tournamentgames_tournamentId_gameId_key" ON "tournamentgames"("tournamentId", "gameId");

-- CreateIndex
CREATE INDEX "transaction_profile_idx" ON "transactions"("profileId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "userachievements_userId_achievementId_key" ON "userachievements"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "vip_infos_userid_key" ON "vip_infos"("userid");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_sessions" ADD CONSTRAINT "platform_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operators" ADD CONSTRAINT "operators_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twoFactors" ADD CONSTRAINT "twoFactors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatmessages" ADD CONSTRAINT "chatmessages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chatrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatmessages" ADD CONSTRAINT "chatmessages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatrooms" ADD CONSTRAINT "chatrooms_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "gamesessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamesessions" ADD CONSTRAINT "gamesessions_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamesessions" ADD CONSTRAINT "gamesessions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamesessions" ADD CONSTRAINT "gamesessions_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamesessions" ADD CONSTRAINT "gamesessions_vipInfoId_fkey" FOREIGN KEY ("vipInfoId") REFERENCES "vip_infos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamententries" ADD CONSTRAINT "tournamententries_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamententries" ADD CONSTRAINT "tournamententries_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamententries" ADD CONSTRAINT "tournamententries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamentgames" ADD CONSTRAINT "tournamentgames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamentgames" ADD CONSTRAINT "tournamentgames_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "gamesessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_vipInfoId_fkey" FOREIGN KEY ("vipInfoId") REFERENCES "vip_infos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userachievements" ADD CONSTRAINT "userachievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userachievements" ADD CONSTRAINT "userachievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rainbets" ADD CONSTRAINT "rainbets_rainHistoryId_fkey" FOREIGN KEY ("rainHistoryId") REFERENCES "rainhistories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rainbets" ADD CONSTRAINT "rainbets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rainhistories" ADD CONSTRAINT "rainhistories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raintips" ADD CONSTRAINT "raintips_rainHistoryId_fkey" FOREIGN KEY ("rainHistoryId") REFERENCES "rainhistories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raintips" ADD CONSTRAINT "raintips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rainwinners" ADD CONSTRAINT "rainwinners_rainHistoryId_fkey" FOREIGN KEY ("rainHistoryId") REFERENCES "rainhistories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rainwinners" ADD CONSTRAINT "rainwinners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vip_infos" ADD CONSTRAINT "vip_infos_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vip_infos" ADD CONSTRAINT "vip_infos_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
