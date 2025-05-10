export type GameCategoryName = "TABLE" | "FISH" | "POKER" | "SLOTS" | "OTHER";

export interface Game {
  id: string;
  name: string;
  title: string;
  temperature: string | null;
  developer: string | null;
  vipLevel: number | null;
  isActive: boolean | null;
  device: number | null;
  featured: boolean | null;
  gamebank: string | null;
  bet: number | null;
  denomination: number | null;
  categoryTemp: number | null;
  originalId: number | null;
  bids: number | null;
  statIn: number | null;
  statOut: number | null;
  currentRtp: number | null;
  rtpStatIn: number | null;
  rtpStatOut: number | null;
  standardRtp: number | null;
  popularity: number | null;
  chanceFirepot1: number | null;
  chanceFirepot2: number | null;
  chanceFirepot3: number | null;
  fireCount1: number | null;
  fireCount2: number | null;
  fireCount3: number | null;
  linesPercentConfigSpin: string | null;
  linesPercentConfigSpinBonus: string | null;
  linesPercentConfigBonus: string | null;
  linesPercentConfigBonusBonus: string | null;
  rezerv: number | null;
  cask: number | null;
  advanced: string | null;
  scaleMode: string;
  slotViewState: string;
  view: number | null;
  categoryId: string | null;
  operatorId: string | null;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: GameCategoryName;
  jackpotGroupId: string | null;
  active: boolean;
  password: string | null;
  // operator: Operator | null;
}

export interface GameCategory {
  image: string;
  pictures: string;
  game_count: string | number;
  name: string;
  slug: string;
  games: Array<Search>;
  page_no: number;
}
export interface GameListResponse {
  code: number;
  list: Array<Game>;
  total: number;
}
export interface Search {
  id: string;
  name: string;
  image: string;
  developer: string;
  is_demo: boolean;
}

export interface GameItem {
  id: number;
  name: string;
  image: string;
  developer: string;
  producer: string;
  is_demo: boolean;
}

export interface GameEnterBody {
  id: string | Array<string>;
  demo: boolean;
}

export interface GameUserBody {
  game_categories_slug: string;
  page: number;
  limit: number;
}

export interface GameEnterResponse {
  method: string;
  parames: string;
  developer: string;
  reserve: string;
  weburl: string;
}

export interface GameHistoryItem {
  name: string;
  created_at: number;
  amount: string | number;
  multiplier: string | number;
  bet_id: string | number;
  status: string | number;
  profit: number;
}

export interface GameBigWinItem {
  game_id: string;
  game_name: string;
  game_icon: string;
  user_name: string;
  user_vip_group: number;
  user_vip_level: number;
  bet_amount: string;
  multiplier: string;
  win_amount: string;
  time: number;
}

export interface GameBigWinData {
  high_rollers: Array<GameBigWinItem>;
  lucky_bets: Array<GameBigWinItem>;
}

export interface GameHistoryResponse {
  total_pages: number;
  record: Array<GameHistoryItem>;
}

export interface GameSearchResponse {
  list: Array<Search>;
  total: number;
}

export type GetGameFavoriteListResponse = {
  code: number;
  data: Array<number | string>;
  message: string;
};

export type GetGameBigWinResponse = {
  code: number;
  data: GameBigWinData;
  message: string;
};
export type Category = {
  name: string;
  games: Game[];
};

export type GetGameCategoriesResponse = {
  code: number;
  data: Array<any>;
  messsage: string;
};

export type GetGameSearchResponse = {
  code: number;
  data: GameSearchResponse;
  message: string;
};

export type GetGameEnterResponse = {
  code: number;
  data: GameEnterResponse;
  message: string;
};

export type GetGameHistoryResponse = {
  code: number;
  data: GameHistoryResponse;
  message: string;
};
