import { User } from "../index";

export interface GetUserInfo {
  uid: string;
  username: string;
  avatar: string;
  first_name: string;
  last_name: string;
  id: number | string;
  id_number: string;
  email: string;
  email_confirmd: boolean;
  phone: string;
  phone_confirmd: boolean;
  date_of_birth: string;
  county: string;
  state: string;
  city: string;
  address: string;
  postal_code: string;
  language: string;
  locale: string;
  initial_profile_complete: boolean;
  is_supended: number;
  sys_communications: boolean;
  locked_personal_info_fields: Array<string>;
  create_at: number;
}
export interface GetUserAmount {
  amount: number;
  currency: {
    fiat: true;
    name: string;
    symbol: string;
    type: string;
  };
  withdraw: number;
  rate: number;
}
export interface UpdateEmail {
  email: string;
  password: string;
}
export interface UpdateCashtag {
  cashtag: string;
  password: string;
}
export interface UpdatePassword {
  now_password: string;
  new_password: string;
}
export interface GetUserBalance {
  amount: number;
  currency: string;
  availabe_balance: number;
  real: number | string;
  bonus: number | string;
}
export interface UpdateSuspendUser {
  time: number;
}
export type GetUserInfoResponseData = {
  code: number;
  user: Partial<User>;
  // message: string;
};
export type GetUserBalanceResponseData = {
  code: number;
  data: GetUserBalance;
  message: string;
};
export type GetUserEmailVerifyResponseData = {
  code: number;
  time: number;
  message: string;
};
export type GetUserAmountResponseData = {
  code: number;
  data: GetUserAmount;
  message: string;
};

export type ProfileStatsUpdateData = {
  balance: number;
  createdAt: Date;
  currency: "USD";
  id: string;
  isActive: boolean;
  lastPlayed: Date;
  phpId: number;
  shopId: string;
  updatedAt: string | null;
  userId: string;
  xpEarned: number;
};

export type UserStatsUpdateData = {
  balance: number;
  totalXp: number;
};

export type StatsUpdate = {
  table: string;
  table_name: string;
  row_id: string;
  operation: "UPDATE" | "INSERT" | "DELETE";
  data: UserStatsUpdateData | ProfileStatsUpdateData;
  event_id: number;
};
