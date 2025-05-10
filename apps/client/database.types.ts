export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account: {
        Row: {
          accessToken: string | null
          accessTokenExpiresAt: string | null
          accountId: string
          createdAt: string
          id: string
          idToken: string | null
          password: string | null
          providerId: string
          refreshToken: string | null
          refreshTokenExpiresAt: string | null
          scope: string | null
          updatedAt: string | null
          userId: string
        }
        Insert: {
          accessToken?: string | null
          accessTokenExpiresAt?: string | null
          accountId: string
          createdAt?: string
          id: string
          idToken?: string | null
          password?: string | null
          providerId: string
          refreshToken?: string | null
          refreshTokenExpiresAt?: string | null
          scope?: string | null
          updatedAt?: string | null
          userId: string
        }
        Update: {
          accessToken?: string | null
          accessTokenExpiresAt?: string | null
          accountId?: string
          createdAt?: string
          id?: string
          idToken?: string | null
          password?: string | null
          providerId?: string
          refreshToken?: string | null
          refreshTokenExpiresAt?: string | null
          scope?: string | null
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement: {
        Row: {
          createdAt: string
          description: string
          id: string
          isActive: boolean
          name: string
          reward: number | null
          targetXp: number
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          description: string
          id: string
          isActive?: boolean
          name: string
          reward?: number | null
          targetXp: number
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          description?: string
          id?: string
          isActive?: boolean
          name?: string
          reward?: number | null
          targetXp?: number
          updatedAt?: string | null
        }
        Relationships: []
      }
      chatmessages: {
        Row: {
          channel: Database["public"]["Enums"]["ChatChannel"]
          content: string
          createdAt: string
          id: string
          metadata: Json | null
          roomId: string | null
          userId: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["ChatChannel"]
          content: string
          createdAt?: string
          id: string
          metadata?: Json | null
          roomId?: string | null
          userId: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["ChatChannel"]
          content?: string
          createdAt?: string
          id?: string
          metadata?: Json | null
          roomId?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatmessages_roomId_fkey"
            columns: ["roomId"]
            isOneToOne: false
            referencedRelation: "chatrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatmessages_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      chatrooms: {
        Row: {
          createdAt: string
          gameSessionId: string | null
          id: string
          isGameRoom: boolean
          name: string
        }
        Insert: {
          createdAt?: string
          gameSessionId?: string | null
          id: string
          isGameRoom?: boolean
          name: string
        }
        Update: {
          createdAt?: string
          gameSessionId?: string | null
          id?: string
          isGameRoom?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatrooms_gameSessionId_fkey"
            columns: ["gameSessionId"]
            isOneToOne: false
            referencedRelation: "gamesessions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          created_at: string | null
          id: number
          operation: string
          payload: Json | null
          row_id: string | null
          table_name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          operation: string
          payload?: Json | null
          row_id?: string | null
          table_name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          operation?: string
          payload?: Json | null
          row_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          createdAt: string
          friendId: string
          id: string
          status: Database["public"]["Enums"]["FriendshipStatus"]
          updatedAt: string | null
          userId: string
        }
        Insert: {
          createdAt?: string
          friendId: string
          id: string
          status?: Database["public"]["Enums"]["FriendshipStatus"]
          updatedAt?: string | null
          userId: string
        }
        Update: {
          createdAt?: string
          friendId?: string
          id?: string
          status?: Database["public"]["Enums"]["FriendshipStatus"]
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friendId_fkey"
            columns: ["friendId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          active: boolean
          advanced: string | null
          bet: number | null
          bids: number | null
          cask: number | null
          category: Database["public"]["Enums"]["GameCategory"]
          categoryId: string | null
          categoryTemp: number | null
          chanceFirepot1: number | null
          chanceFirepot2: number | null
          chanceFirepot3: number | null
          createdAt: string
          currentRtp: number | null
          denomination: number | null
          developer: string | null
          device: number | null
          featured: boolean | null
          fireCount1: number | null
          fireCount2: number | null
          fireCount3: number | null
          gamebank: string | null
          id: string
          isActive: boolean | null
          jackpotGroupId: string | null
          linesPercentConfigBonus: string | null
          linesPercentConfigBonusBonus: string | null
          linesPercentConfigSpin: string | null
          linesPercentConfigSpinBonus: string | null
          name: string
          operatorId: string | null
          originalId: number | null
          password: string | null
          popularity: number | null
          providerId: string | null
          rezerv: number | null
          rtpStatIn: number | null
          rtpStatOut: number | null
          scaleMode: string
          slotViewState: string
          standardRtp: number | null
          statIn: number | null
          statOut: number | null
          temperature: string | null
          title: string
          updatedAt: string | null
          view: number | null
          vipLevel: number | null
        }
        Insert: {
          active?: boolean
          advanced?: string | null
          bet?: number | null
          bids?: number | null
          cask?: number | null
          category?: Database["public"]["Enums"]["GameCategory"]
          categoryId?: string | null
          categoryTemp?: number | null
          chanceFirepot1?: number | null
          chanceFirepot2?: number | null
          chanceFirepot3?: number | null
          createdAt?: string
          currentRtp?: number | null
          denomination?: number | null
          developer?: string | null
          device?: number | null
          featured?: boolean | null
          fireCount1?: number | null
          fireCount2?: number | null
          fireCount3?: number | null
          gamebank?: string | null
          id: string
          isActive?: boolean | null
          jackpotGroupId?: string | null
          linesPercentConfigBonus?: string | null
          linesPercentConfigBonusBonus?: string | null
          linesPercentConfigSpin?: string | null
          linesPercentConfigSpinBonus?: string | null
          name: string
          operatorId?: string | null
          originalId?: number | null
          password?: string | null
          popularity?: number | null
          providerId?: string | null
          rezerv?: number | null
          rtpStatIn?: number | null
          rtpStatOut?: number | null
          scaleMode?: string
          slotViewState?: string
          standardRtp?: number | null
          statIn?: number | null
          statOut?: number | null
          temperature?: string | null
          title: string
          updatedAt?: string | null
          view?: number | null
          vipLevel?: number | null
        }
        Update: {
          active?: boolean
          advanced?: string | null
          bet?: number | null
          bids?: number | null
          cask?: number | null
          category?: Database["public"]["Enums"]["GameCategory"]
          categoryId?: string | null
          categoryTemp?: number | null
          chanceFirepot1?: number | null
          chanceFirepot2?: number | null
          chanceFirepot3?: number | null
          createdAt?: string
          currentRtp?: number | null
          denomination?: number | null
          developer?: string | null
          device?: number | null
          featured?: boolean | null
          fireCount1?: number | null
          fireCount2?: number | null
          fireCount3?: number | null
          gamebank?: string | null
          id?: string
          isActive?: boolean | null
          jackpotGroupId?: string | null
          linesPercentConfigBonus?: string | null
          linesPercentConfigBonusBonus?: string | null
          linesPercentConfigSpin?: string | null
          linesPercentConfigSpinBonus?: string | null
          name?: string
          operatorId?: string | null
          originalId?: number | null
          password?: string | null
          popularity?: number | null
          providerId?: string | null
          rezerv?: number | null
          rtpStatIn?: number | null
          rtpStatOut?: number | null
          scaleMode?: string
          slotViewState?: string
          standardRtp?: number | null
          statIn?: number | null
          statOut?: number | null
          temperature?: string | null
          title?: string
          updatedAt?: string | null
          view?: number | null
          vipLevel?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "games_operatorId_fkey"
            columns: ["operatorId"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      gamesessions: {
        Row: {
          active: boolean
          betAmount: number | null
          endTime: string | null
          gameId: string
          id: string
          metadata: Json | null
          profileId: string
          startTime: string
          tournamentId: string | null
          vipInfoId: string | null
          winAmount: number | null
          xpEarned: number
        }
        Insert: {
          active?: boolean
          betAmount?: number | null
          endTime?: string | null
          gameId: string
          id: string
          metadata?: Json | null
          profileId: string
          startTime?: string
          tournamentId?: string | null
          vipInfoId?: string | null
          winAmount?: number | null
          xpEarned?: number
        }
        Update: {
          active?: boolean
          betAmount?: number | null
          endTime?: string | null
          gameId?: string
          id?: string
          metadata?: Json | null
          profileId?: string
          startTime?: string
          tournamentId?: string | null
          vipInfoId?: string | null
          winAmount?: number | null
          xpEarned?: number
        }
        Relationships: [
          {
            foreignKeyName: "gamesessions_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gamesessions_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gamesessions_tournamentId_fkey"
            columns: ["tournamentId"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gamesessions_vipInfoId_fkey"
            columns: ["vipInfoId"]
            isOneToOne: false
            referencedRelation: "vip_infos"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          email: string
          expiresAt: string
          id: string
          inviterId: string
          organizationId: string
          role: string | null
          status: string
        }
        Insert: {
          email: string
          expiresAt: string
          id: string
          inviterId: string
          organizationId: string
          role?: string | null
          status: string
        }
        Update: {
          email?: string
          expiresAt?: string
          id?: string
          inviterId?: string
          organizationId?: string
          role?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_inviterId_fkey"
            columns: ["inviterId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          createdAt: string
          id: string
          organizationId: string
          role: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          organizationId: string
          role: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          organizationId?: string
          role?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          authorId: string | null
          content: string | null
          createdAt: string
          id: string
          updatedAt: string | null
        }
        Insert: {
          authorId?: string | null
          content?: string | null
          createdAt?: string
          id: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string | null
          content?: string | null
          createdAt?: string
          id?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          createdAt: string
          id: string
          isRead: boolean
          message: string
          metadata: Json | null
          readAt: string | null
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          isRead?: boolean
          message: string
          metadata?: Json | null
          readAt?: string | null
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          isRead?: boolean
          message?: string
          metadata?: Json | null
          readAt?: string | null
          title?: string
          type?: Database["public"]["Enums"]["NotificationType"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      operatorgames: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          isActive: boolean
          isPromoted: boolean
          maxBet: number | null
          minBet: number | null
          name: string
          operatorId: string
          slug: string
          thumbnail: string | null
          updatedAt: string | null
          xpMultiplier: number
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          isActive?: boolean
          isPromoted?: boolean
          maxBet?: number | null
          minBet?: number | null
          name: string
          operatorId: string
          slug: string
          thumbnail?: string | null
          updatedAt?: string | null
          xpMultiplier?: number
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          isActive?: boolean
          isPromoted?: boolean
          maxBet?: number | null
          minBet?: number | null
          name?: string
          operatorId?: string
          slug?: string
          thumbnail?: string | null
          updatedAt?: string | null
          xpMultiplier?: number
        }
        Relationships: []
      }
      operators: {
        Row: {
          acceptedPayments: string[] | null
          balance: number
          createdAt: string
          description: string | null
          id: string
          isActive: boolean
          logo: string | null
          name: string
          ownerId: string
          slug: string
          updatedAt: string | null
        }
        Insert: {
          acceptedPayments?: string[] | null
          balance?: number
          createdAt?: string
          description?: string | null
          id: string
          isActive?: boolean
          logo?: string | null
          name: string
          ownerId: string
          slug: string
          updatedAt?: string | null
        }
        Update: {
          acceptedPayments?: string[] | null
          balance?: number
          createdAt?: string
          description?: string | null
          id?: string
          isActive?: boolean
          logo?: string | null
          name?: string
          ownerId?: string
          slug?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operators_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          createdAt: string
          id: string
          logo: string | null
          metadata: string | null
          name: string
          slug: string | null
        }
        Insert: {
          createdAt?: string
          id: string
          logo?: string | null
          metadata?: string | null
          name: string
          slug?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          logo?: string | null
          metadata?: string | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      platform_sessions: {
        Row: {
          active: boolean
          activeGameId: string | null
          createdAt: string
          expiresAt: string
          id: string
          ipAddress: string | null
          refreshToken: string | null
          token: string
          updatedAt: string | null
          userAgent: string | null
          userId: string
        }
        Insert: {
          active?: boolean
          activeGameId?: string | null
          createdAt?: string
          expiresAt: string
          id: string
          ipAddress?: string | null
          refreshToken?: string | null
          token: string
          updatedAt?: string | null
          userAgent?: string | null
          userId: string
        }
        Update: {
          active?: boolean
          activeGameId?: string | null
          createdAt?: string
          expiresAt?: string
          id?: string
          ipAddress?: string | null
          refreshToken?: string | null
          token?: string
          updatedAt?: string | null
          userAgent?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_sessions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          amountToReceiveInCredits: number
          bestValue: number
          bonusCode: string | null
          bonusSpins: number
          bonusTotalInCredits: number
          createdAt: string
          description: string
          discountInCents: number
          id: string
          isPromo: boolean | null
          priceInCents: number
          shopId: string | null
          title: string
          totalDiscountInCents: number
          type: string
          updatedAt: string | null
          url: string
        }
        Insert: {
          amountToReceiveInCredits?: number
          bestValue?: number
          bonusCode?: string | null
          bonusSpins?: number
          bonusTotalInCredits?: number
          createdAt?: string
          description?: string
          discountInCents?: number
          id: string
          isPromo?: boolean | null
          priceInCents?: number
          shopId?: string | null
          title?: string
          totalDiscountInCents?: number
          type?: string
          updatedAt?: string | null
          url?: string
        }
        Update: {
          amountToReceiveInCredits?: number
          bestValue?: number
          bonusCode?: string | null
          bonusSpins?: number
          bonusTotalInCredits?: number
          createdAt?: string
          description?: string
          discountInCents?: number
          id?: string
          isPromo?: boolean | null
          priceInCents?: number
          shopId?: string | null
          title?: string
          totalDiscountInCents?: number
          type?: string
          updatedAt?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_shopId_fkey"
            columns: ["shopId"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          balance: number
          createdAt: string
          currency: string
          id: string
          isActive: boolean
          lastPlayed: string | null
          phpId: number | null
          shopId: string
          updatedAt: string | null
          userId: string
          xpEarned: number
        }
        Insert: {
          balance?: number
          createdAt?: string
          currency?: string
          id: string
          isActive?: boolean
          lastPlayed?: string | null
          phpId?: number | null
          shopId: string
          updatedAt?: string | null
          userId: string
          xpEarned?: number
        }
        Update: {
          balance?: number
          createdAt?: string
          currency?: string
          id?: string
          isActive?: boolean
          lastPlayed?: string | null
          phpId?: number | null
          shopId?: string
          updatedAt?: string | null
          userId?: string
          xpEarned?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_shopId_fkey"
            columns: ["shopId"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      rainbets: {
        Row: {
          betAmount: number
          id: string
          odds: number
          outcome: string | null
          rainHistoryId: string
          settledAt: string | null
          userId: string
        }
        Insert: {
          betAmount: number
          id: string
          odds: number
          outcome?: string | null
          rainHistoryId: string
          settledAt?: string | null
          userId: string
        }
        Update: {
          betAmount?: number
          id?: string
          odds?: number
          outcome?: string | null
          rainHistoryId?: string
          settledAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "rainbets_rainHistoryId_fkey"
            columns: ["rainHistoryId"]
            isOneToOne: false
            referencedRelation: "rainhistories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rainbets_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      rainhistories: {
        Row: {
          amount: number
          createdAt: string
          id: string
          rainType: string
          userId: string
        }
        Insert: {
          amount: number
          createdAt?: string
          id: string
          rainType: string
          userId: string
        }
        Update: {
          amount?: number
          createdAt?: string
          id?: string
          rainType?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "rainhistories_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      raintips: {
        Row: {
          id: string
          rainHistoryId: string
          tipAmount: number
          tippedAt: string
          userId: string
        }
        Insert: {
          id: string
          rainHistoryId: string
          tipAmount: number
          tippedAt?: string
          userId: string
        }
        Update: {
          id?: string
          rainHistoryId?: string
          tipAmount?: number
          tippedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "raintips_rainHistoryId_fkey"
            columns: ["rainHistoryId"]
            isOneToOne: false
            referencedRelation: "rainhistories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raintips_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      rainwinners: {
        Row: {
          id: string
          rainHistoryId: string
          userId: string
          wonAmount: number
          wonAt: string
        }
        Insert: {
          id: string
          rainHistoryId: string
          userId: string
          wonAmount: number
          wonAt?: string
        }
        Update: {
          id?: string
          rainHistoryId?: string
          userId?: string
          wonAmount?: number
          wonAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "rainwinners_rainHistoryId_fkey"
            columns: ["rainHistoryId"]
            isOneToOne: false
            referencedRelation: "rainhistories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rainwinners_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      tournamententries: {
        Row: {
          id: string
          joinedAt: string
          profileId: string
          score: number
          tournamentId: string
          userId: string
          wagered: number
          won: number
        }
        Insert: {
          id: string
          joinedAt?: string
          profileId: string
          score?: number
          tournamentId: string
          userId: string
          wagered?: number
          won?: number
        }
        Update: {
          id?: string
          joinedAt?: string
          profileId?: string
          score?: number
          tournamentId?: string
          userId?: string
          wagered?: number
          won?: number
        }
        Relationships: [
          {
            foreignKeyName: "tournamententries_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournamententries_tournamentId_fkey"
            columns: ["tournamentId"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournamententries_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      tournamentgames: {
        Row: {
          gameId: string
          id: string
          multiplier: number
          tournamentId: string
        }
        Insert: {
          gameId: string
          id: string
          multiplier?: number
          tournamentId: string
        }
        Update: {
          gameId?: string
          id?: string
          multiplier?: number
          tournamentId?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournamentgames_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournamentgames_tournamentId_fkey"
            columns: ["tournamentId"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          createdAt: string
          description: string | null
          endTime: string
          entryFee: number | null
          id: string
          isActive: boolean
          leaderboard: Json | null
          name: string
          operatorId: string
          prizePool: number
          startTime: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          description?: string | null
          endTime: string
          entryFee?: number | null
          id: string
          isActive?: boolean
          leaderboard?: Json | null
          name: string
          operatorId: string
          prizePool?: number
          startTime: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          description?: string | null
          endTime?: string
          entryFee?: number | null
          id?: string
          isActive?: boolean
          leaderboard?: Json | null
          name?: string
          operatorId?: string
          prizePool?: number
          startTime?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_operatorId_fkey"
            columns: ["operatorId"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          amountCredits: number
          buyerCashtag: string | null
          buyerUserId: string | null
          cashierAvatar: string | null
          cashierId: string | null
          cashiername: string | null
          cashtag: string | null
          createdAt: string
          gameSessionId: string | null
          id: string
          isRealMoney: boolean
          metadata: Json | null
          paymentDetails: Json | null
          paymentMethod: string | null
          processedAt: string | null
          productid: string | null
          profileId: string | null
          reference: string | null
          status: Database["public"]["Enums"]["TransactionStatus"]
          type: Database["public"]["Enums"]["TransactionType"]
          username: string | null
          vipInfoId: string | null
        }
        Insert: {
          amount?: number
          amountCredits?: number
          buyerCashtag?: string | null
          buyerUserId?: string | null
          cashierAvatar?: string | null
          cashierId?: string | null
          cashiername?: string | null
          cashtag?: string | null
          createdAt?: string
          gameSessionId?: string | null
          id: string
          isRealMoney?: boolean
          metadata?: Json | null
          paymentDetails?: Json | null
          paymentMethod?: string | null
          processedAt?: string | null
          productid?: string | null
          profileId?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          type?: Database["public"]["Enums"]["TransactionType"]
          username?: string | null
          vipInfoId?: string | null
        }
        Update: {
          amount?: number
          amountCredits?: number
          buyerCashtag?: string | null
          buyerUserId?: string | null
          cashierAvatar?: string | null
          cashierId?: string | null
          cashiername?: string | null
          cashtag?: string | null
          createdAt?: string
          gameSessionId?: string | null
          id?: string
          isRealMoney?: boolean
          metadata?: Json | null
          paymentDetails?: Json | null
          paymentMethod?: string | null
          processedAt?: string | null
          productid?: string | null
          profileId?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          type?: Database["public"]["Enums"]["TransactionType"]
          username?: string | null
          vipInfoId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_gameSessionId_fkey"
            columns: ["gameSessionId"]
            isOneToOne: false
            referencedRelation: "gamesessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_productid_fkey"
            columns: ["productid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_vipInfoId_fkey"
            columns: ["vipInfoId"]
            isOneToOne: false
            referencedRelation: "vip_infos"
            referencedColumns: ["id"]
          },
        ]
      }
      twoFactors: {
        Row: {
          backupCodes: string
          id: string
          secret: string
          userId: string
        }
        Insert: {
          backupCodes: string
          id: string
          secret: string
          userId: string
        }
        Update: {
          backupCodes?: string
          id?: string
          secret?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "twoFactors_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          accessToken: string | null
          active: boolean
          activeProfileId: string | null
          avatar: string | null
          balance: number
          banExpires: string | null
          banned: boolean | null
          banReason: string | null
          cashtag: string | null
          createdAt: string
          displayUsername: string
          email: string
          emailVerified: boolean | null
          gender: Database["public"]["Enums"]["Gender"] | null
          id: string
          image: string | null
          isOnline: boolean | null
          isVerified: boolean
          lastDailySpin: string | null
          lastLogin: string | null
          name: string | null
          passwordHash: string | null
          phpId: number | null
          role: string | null
          sbId: string | null
          status: Database["public"]["Enums"]["UserStatus"] | null
          totalXp: number
          twoFactorEnabled: boolean | null
          updatedAt: string | null
          username: string
          verificationToken: string | null
          vipInfoId: string | null
        }
        Insert: {
          accessToken?: string | null
          active?: boolean
          activeProfileId?: string | null
          avatar?: string | null
          balance?: number
          banExpires?: string | null
          banned?: boolean | null
          banReason?: string | null
          cashtag?: string | null
          createdAt?: string
          displayUsername?: string
          email: string
          emailVerified?: boolean | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id: string
          image?: string | null
          isOnline?: boolean | null
          isVerified?: boolean
          lastDailySpin?: string | null
          lastLogin?: string | null
          name?: string | null
          passwordHash?: string | null
          phpId?: number | null
          role?: string | null
          sbId?: string | null
          status?: Database["public"]["Enums"]["UserStatus"] | null
          totalXp?: number
          twoFactorEnabled?: boolean | null
          updatedAt?: string | null
          username: string
          verificationToken?: string | null
          vipInfoId?: string | null
        }
        Update: {
          accessToken?: string | null
          active?: boolean
          activeProfileId?: string | null
          avatar?: string | null
          balance?: number
          banExpires?: string | null
          banned?: boolean | null
          banReason?: string | null
          cashtag?: string | null
          createdAt?: string
          displayUsername?: string
          email?: string
          emailVerified?: boolean | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id?: string
          image?: string | null
          isOnline?: boolean | null
          isVerified?: boolean
          lastDailySpin?: string | null
          lastLogin?: string | null
          name?: string | null
          passwordHash?: string | null
          phpId?: number | null
          role?: string | null
          sbId?: string | null
          status?: Database["public"]["Enums"]["UserStatus"] | null
          totalXp?: number
          twoFactorEnabled?: boolean | null
          updatedAt?: string | null
          username?: string
          verificationToken?: string | null
          vipInfoId?: string | null
        }
        Relationships: []
      }
      userachievements: {
        Row: {
          achievementId: string
          createdAt: string
          id: string
          isUnlocked: boolean
          progress: number
          unlockedAt: string | null
          updatedAt: string | null
          userId: string
        }
        Insert: {
          achievementId: string
          createdAt?: string
          id: string
          isUnlocked?: boolean
          progress?: number
          unlockedAt?: string | null
          updatedAt?: string | null
          userId: string
        }
        Update: {
          achievementId?: string
          createdAt?: string
          id?: string
          isUnlocked?: boolean
          progress?: number
          unlockedAt?: string | null
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "userachievements_achievementId_fkey"
            columns: ["achievementId"]
            isOneToOne: false
            referencedRelation: "achievement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userachievements_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      verifications: {
        Row: {
          createdAt: string | null
          expiresAt: string
          id: string
          identifier: string
          updatedAt: string | null
          value: string
        }
        Insert: {
          createdAt?: string | null
          expiresAt: string
          id: string
          identifier: string
          updatedAt?: string | null
          value: string
        }
        Update: {
          createdAt?: string | null
          expiresAt?: string
          id?: string
          identifier?: string
          updatedAt?: string | null
          value?: string
        }
        Relationships: []
      }
      vip_infos: {
        Row: {
          bet_award_switch: boolean
          bet_exp: number
          can_receive_bet_award: boolean
          can_receive_day_award: boolean
          can_receive_level_award: boolean
          can_receive_month_award: boolean
          can_receive_rank_award: boolean
          can_receive_signin_award: boolean
          can_receive_week_award: boolean
          can_receive_withdrawal_award: boolean
          cycle_award_switch: boolean
          deposit_exp: number
          exp_switch_type: number | null
          free_spin_times: number | null
          history_cash_back: number | null
          icon: string | null
          id: string
          is_protection: boolean
          level: number
          level_award_switch: boolean
          level_bet_exp: string | null
          level_deposit_exp: string | null
          main_currency: string | null
          month_gift: number | null
          now_bet_exp: string | null
          now_cash_back: number | null
          now_deposit_exp: string | null
          operatorId: string | null
          protection_bet_amount: string | null
          protection_bet_exp: string | null
          protection_days: number | null
          protection_deposit_amount: string | null
          protection_deposit_exp: string | null
          protection_switch: number | null
          rank_bet_exp: number
          rank_deposit_exp: number
          rank_name: string | null
          signin_award_switch: boolean
          telegram: string | null
          unprotection_bet_amount: string | null
          unprotection_bet_exp: string | null
          unprotection_days: number | null
          unprotection_deposit_amount: string | null
          unprotection_deposit_exp: string | null
          unprotection_switch: number | null
          upgrade_gift: number | null
          userid: string | null
          week_gift: number | null
          withdrawal_award_switch: boolean
          yesterday_cash_back: number | null
        }
        Insert: {
          bet_award_switch?: boolean
          bet_exp?: number
          can_receive_bet_award?: boolean
          can_receive_day_award?: boolean
          can_receive_level_award?: boolean
          can_receive_month_award?: boolean
          can_receive_rank_award?: boolean
          can_receive_signin_award?: boolean
          can_receive_week_award?: boolean
          can_receive_withdrawal_award?: boolean
          cycle_award_switch?: boolean
          deposit_exp?: number
          exp_switch_type?: number | null
          free_spin_times?: number | null
          history_cash_back?: number | null
          icon?: string | null
          id: string
          is_protection?: boolean
          level?: number
          level_award_switch?: boolean
          level_bet_exp?: string | null
          level_deposit_exp?: string | null
          main_currency?: string | null
          month_gift?: number | null
          now_bet_exp?: string | null
          now_cash_back?: number | null
          now_deposit_exp?: string | null
          operatorId?: string | null
          protection_bet_amount?: string | null
          protection_bet_exp?: string | null
          protection_days?: number | null
          protection_deposit_amount?: string | null
          protection_deposit_exp?: string | null
          protection_switch?: number | null
          rank_bet_exp?: number
          rank_deposit_exp?: number
          rank_name?: string | null
          signin_award_switch?: boolean
          telegram?: string | null
          unprotection_bet_amount?: string | null
          unprotection_bet_exp?: string | null
          unprotection_days?: number | null
          unprotection_deposit_amount?: string | null
          unprotection_deposit_exp?: string | null
          unprotection_switch?: number | null
          upgrade_gift?: number | null
          userid?: string | null
          week_gift?: number | null
          withdrawal_award_switch?: boolean
          yesterday_cash_back?: number | null
        }
        Update: {
          bet_award_switch?: boolean
          bet_exp?: number
          can_receive_bet_award?: boolean
          can_receive_day_award?: boolean
          can_receive_level_award?: boolean
          can_receive_month_award?: boolean
          can_receive_rank_award?: boolean
          can_receive_signin_award?: boolean
          can_receive_week_award?: boolean
          can_receive_withdrawal_award?: boolean
          cycle_award_switch?: boolean
          deposit_exp?: number
          exp_switch_type?: number | null
          free_spin_times?: number | null
          history_cash_back?: number | null
          icon?: string | null
          id?: string
          is_protection?: boolean
          level?: number
          level_award_switch?: boolean
          level_bet_exp?: string | null
          level_deposit_exp?: string | null
          main_currency?: string | null
          month_gift?: number | null
          now_bet_exp?: string | null
          now_cash_back?: number | null
          now_deposit_exp?: string | null
          operatorId?: string | null
          protection_bet_amount?: string | null
          protection_bet_exp?: string | null
          protection_days?: number | null
          protection_deposit_amount?: string | null
          protection_deposit_exp?: string | null
          protection_switch?: number | null
          rank_bet_exp?: number
          rank_deposit_exp?: number
          rank_name?: string | null
          signin_award_switch?: boolean
          telegram?: string | null
          unprotection_bet_amount?: string | null
          unprotection_bet_exp?: string | null
          unprotection_days?: number | null
          unprotection_deposit_amount?: string | null
          unprotection_deposit_exp?: string | null
          unprotection_switch?: number | null
          upgrade_gift?: number | null
          userid?: string | null
          week_gift?: number | null
          withdrawal_award_switch?: boolean
          yesterday_cash_back?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vip_infos_operatorId_fkey"
            columns: ["operatorId"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vip_infos_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      arcade_increment_crystals: {
        Args: { row_id: number; val: number }
        Returns: undefined
      }
      check_min_rights: {
        Args:
          | {
              min_right: Database["public"]["Enums"]["user_min_right"]
              org_id: string
              app_id: string
              channel_id: number
            }
          | {
              min_right: Database["public"]["Enums"]["user_min_right"]
              user_id: string
              org_id: string
              app_id: string
              channel_id: number
            }
        Returns: boolean
      }
      convert_bytes_to_gb: {
        Args: { byt: number }
        Returns: number
      }
      convert_bytes_to_mb: {
        Args: { byt: number }
        Returns: number
      }
      convert_gb_to_bytes: {
        Args: { gb: number }
        Returns: number
      }
      convert_mb_to_bytes: {
        Args: { gb: number }
        Returns: number
      }
      convert_number_to_percent: {
        Args: { val: number; max_val: number }
        Returns: number
      }
      count_all_apps: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_all_need_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_all_onboarded: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_all_paying: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_all_plans: {
        Args: Record<PropertyKey, never>
        Returns: {
          product_id: string
          count: number
        }[]
      }
      count_all_trial: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_all_updates: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      ddlx_get_dependants: {
        Args: { "": unknown }
        Returns: Record<string, unknown>[]
      }
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      exist_app_v2: {
        Args: { appid: string }
        Returns: boolean
      }
      exist_app_versions: {
        Args: { appid: string; name_version: string; apikey: string }
        Returns: boolean
      }
      exist_user: {
        Args: { e_mail: string }
        Returns: string
      }
      find_best_plan_v3: {
        Args: { mau: number; bandwidth: number; storage: number }
        Returns: string
      }
      find_fit_plan_v3: {
        Args: { mau: number; bandwidth: number; storage: number }
        Returns: {
          name: string
        }[]
      }
      generate_inbox: {
        Args: { size: number }
        Returns: string
      }
      get_apikey: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_app_versions: {
        Args: { appid: string; name_version: string; apikey: string }
        Returns: number
      }
      get_current_plan_max: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: string
      }
      get_current_plan_name: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: string
      }
      get_cycle_info: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: {
          subscription_anchor_start: string
          subscription_anchor_end: string
        }[]
      }
      get_db_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_devices_version: {
        Args: { app_id: string; version_id: number }
        Returns: number
      }
      get_external_function_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_max_plan: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: {
          mau: number
          storage: number
          bandwidth: number
        }[]
      }
      get_metered_usage: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: number
      }
      get_plan_usage_percent: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: number
      }
      get_total_app_storage_size: {
        Args: { app_id: string } | { userid: string; app_id: string }
        Returns: number
      }
      get_total_stats_v2: {
        Args: { dateid: string } | { userid: string; dateid: string }
        Returns: {
          mau: number
          bandwidth: number
          storage: number
        }[]
      }
      get_total_stats_v3: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: {
          mau: number
          bandwidth: number
          storage: number
        }[]
      }
      get_total_storage_size: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: number
      }
      get_total_storage_size_org: {
        Args: { org_id: string }
        Returns: number
      }
      get_usage_mode_and_last_saved: {
        Args: Record<PropertyKey, never>
        Returns: {
          usage_mode: Database["public"]["Enums"]["usage_mode"]
          last_saved: string
        }[]
      }
      get_user_id: {
        Args: { apikey: string }
        Returns: string
      }
      get_weekly_stats: {
        Args: { app_id: string }
        Returns: {
          all_updates: number
          failed_updates: number
          open_app: number
        }[]
      }
      handle_wheel_of_fortune_spin: {
        Args: { row_id: string; crystals_to_add: number }
        Returns: undefined
      }
      has_min_right: {
        Args: {
          _userid: string
          _orgid: string
          _right: Database["public"]["Enums"]["user_min_right"]
          _appid?: string
          _channelid?: number
        }
        Returns: boolean
      }
      http_post_helper: {
        Args: { function_name: string; function_type: string; body: Json }
        Returns: undefined
      }
      increment_coins: {
        Args: { row_id: string; val: number }
        Returns: undefined
      }
      increment_coins_from_arcade: {
        Args: { row_id: number; val: number }
        Returns: undefined
      }
      increment_crystals: {
        Args: { row_id: number; val: number }
        Returns: undefined
      }
      increment_crystals_from_arcade: {
        Args: { row_id: number; val: number }
        Returns: undefined
      }
      increment_store: {
        Args: { app_id: string; updates: number }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: boolean
      }
      is_allowed_action: {
        Args: { apikey: string } | { apikey: string; appid: string }
        Returns: boolean
      }
      is_allowed_action_user: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: boolean
      }
      is_allowed_capgkey: {
        Args:
          | {
              apikey: string
              keymode: Database["public"]["Enums"]["key_mode"][]
            }
          | {
              apikey: string
              keymode: Database["public"]["Enums"]["key_mode"][]
              app_id: string
            }
        Returns: boolean
      }
      is_app_owner: {
        Args:
          | { apikey: string; appid: string }
          | { appid: string }
          | { userid: string; appid: string }
        Returns: boolean
      }
      is_app_shared: {
        Args: { appid: string } | { userid: string; appid: string }
        Returns: boolean
      }
      is_canceled: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: boolean
      }
      is_free_usage: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: boolean
      }
      is_good_plan_v3: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: boolean
      }
      is_good_plan_v4: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: boolean
      }
      is_in_channel: {
        Args: { userid: string } | { userid: string; ownerid: string }
        Returns: boolean
      }
      is_not_deleted: {
        Args: { email_check: string }
        Returns: boolean
      }
      is_onboarded: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: boolean
      }
      is_onboarding_needed: {
        Args: Record<PropertyKey, never> | { userid: string }
        Returns: boolean
      }
      is_paying: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_trial: {
        Args: { userid: string }
        Returns: number
      }
      is_version_shared: {
        Args: { userid: string; versionid: number }
        Returns: boolean
      }
      nolimit_decrement_crystals: {
        Args: { row_id: string; val: number }
        Returns: Json
      }
      nolimit_increment_coins: {
        Args: { row_id: string; val: number }
        Returns: Json
      }
      one_month_ahead: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      remove_enum_value: {
        Args: { enum_type: unknown; enum_value: string }
        Returns: undefined
      }
    }
    Enums: {
      ChatChannel: "LOBBY" | "GAME" | "TOURNAMENT" | "PRIVATE"
      FriendshipStatus: "PENDING" | "ACCEPTED" | "BLOCKED"
      GameCategory: "TABLE" | "FISH" | "POKER" | "SLOTS" | "OTHER"
      Gender: "BOY" | "GIRL" | "ALIEN" | "UNSURE" | "ROBOT" | "COMPLICATED"
      key_mode: "read" | "write" | "all" | "upload"
      message_state: "read" | "unread" | "group"
      NotificationType:
        | "SYSTEM"
        | "FRIEND_REQUEST"
        | "ACHIEVEMENT"
        | "BALANCE_UPDATE"
        | "PROMOTIONAL"
        | "TOURNAMENT"
      platform_os: "ios" | "android"
      product_cost: "D500" | "D1000" | "D2000" | "D5000" | "D10000"
      request_status: "PENDING" | "SUCCESS" | "ERROR"
      stripe_status:
        | "created"
        | "succeeded"
        | "updated"
        | "failed"
        | "deleted"
        | "canceled"
      transaction_status: "PENDING" | "COMPLETED" | "DENIED"
      TransactionStatus:
        | "PENDING"
        | "COMPLETED"
        | "FAILED"
        | "CANCELLED"
        | "REFUNDED"
        | "EXPIRED"
        | "REJECTED"
      TransactionType:
        | "DEPOSIT"
        | "WITHDRAWAL"
        | "BET"
        | "WIN"
        | "BONUS"
        | "DONATION"
        | "ADJUSTMENT"
        | "TOURNAMENT_BUYIN"
        | "TOURNAMENT_PRIZE"
      usage_mode: "last_saved" | "min5" | '"day"' | '"cycle"'
      user_min_right: "read" | "upload" | "write" | "admin"
      user_role: "read" | "upload" | "write" | "admin"
      user_status: "ONLINE" | "OFFLINE" | "BUSY" | "AWAY"
      UserStatus: "ACTIVE" | "INACTIVE" | "ONLINE" | "OFFLINE"
      volatility: "HIGH" | "MEDIUM" | "LOW"
    }
    CompositeTypes: {
      stats_table: {
        mau: number | null
        bandwidth: number | null
        storage: number | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ChatChannel: ["LOBBY", "GAME", "TOURNAMENT", "PRIVATE"],
      FriendshipStatus: ["PENDING", "ACCEPTED", "BLOCKED"],
      GameCategory: ["TABLE", "FISH", "POKER", "SLOTS", "OTHER"],
      Gender: ["BOY", "GIRL", "ALIEN", "UNSURE", "ROBOT", "COMPLICATED"],
      key_mode: ["read", "write", "all", "upload"],
      message_state: ["read", "unread", "group"],
      NotificationType: [
        "SYSTEM",
        "FRIEND_REQUEST",
        "ACHIEVEMENT",
        "BALANCE_UPDATE",
        "PROMOTIONAL",
        "TOURNAMENT",
      ],
      platform_os: ["ios", "android"],
      product_cost: ["D500", "D1000", "D2000", "D5000", "D10000"],
      request_status: ["PENDING", "SUCCESS", "ERROR"],
      stripe_status: [
        "created",
        "succeeded",
        "updated",
        "failed",
        "deleted",
        "canceled",
      ],
      transaction_status: ["PENDING", "COMPLETED", "DENIED"],
      TransactionStatus: [
        "PENDING",
        "COMPLETED",
        "FAILED",
        "CANCELLED",
        "REFUNDED",
        "EXPIRED",
        "REJECTED",
      ],
      TransactionType: [
        "DEPOSIT",
        "WITHDRAWAL",
        "BET",
        "WIN",
        "BONUS",
        "DONATION",
        "ADJUSTMENT",
        "TOURNAMENT_BUYIN",
        "TOURNAMENT_PRIZE",
      ],
      usage_mode: ["last_saved", "min5", '"day"', '"cycle"'],
      user_min_right: ["read", "upload", "write", "admin"],
      user_role: ["read", "upload", "write", "admin"],
      user_status: ["ONLINE", "OFFLINE", "BUSY", "AWAY"],
      UserStatus: ["ACTIVE", "INACTIVE", "ONLINE", "OFFLINE"],
      volatility: ["HIGH", "MEDIUM", "LOW"],
    },
  },
} as const
