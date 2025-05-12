import { defineStore } from "pinia";
import { NETWORK_CONFIG } from "@cashflow/types";
import { handleException } from "./exception";
import { useAuthStore } from "@/stores/auth";
import { useAppBarStore } from "@/stores/appBar";
import { Network } from "@/utils/Network";

type dialogType = "login" | "signup";

namespace Game {
  export type Category = any;
  export type GameSearchResponse = {
    list: any[];
    total: number;
  };
  export type GameEnterResponse = {
    method: string;
    parames: string;
    developer: string;
    reserve: string;
    weburl: string;
  };
  export type Search = any;
  export type GameHistoryResponse = {
    total_pages: number;
    record: any[];
  };
  export type GameBigWinData = {
    high_rollers: any[];
    lucky_bets: any[];
  };
  export type GetGameCategoriesResponse = {
    code: number;
    data: Category[];
  };
  export type GetGameSearchResponse = {
    code: number;
    data: GameSearchResponse;
  };
  export type GameUserBody = any;
  export type GetGameEnterResponse = {
    code: number;
    data: GameEnterResponse;
  };
  export type GetGameHistoryResponse = {
    code: number;
    data: GameHistoryResponse;
  };
  export type GetGameBigWinResponse = {
    code: number;
    data: GameBigWinData;
  };
  export type GetGameFavoriteListResponse = {
    code: number;
    data: (number | string)[];
  };
  export type GameEnterBody = {
    id: string | string[];
    demo: boolean;
  };
}

export const useGameStore = defineStore(
  "game",
  () => {
    /**
     * @state success - Indicates if the last operation was successful.
     */
    const success = ref<boolean>(false);
    /**
     * @state errMessage - Stores the error message if an operation fails.
     */
    const errMessage = ref<string>("");

    /**
     * @state gameCategories - An array of game categories.
     */
    const gameCategories = ref<Array<Game.Category>>([]);

    /**
     * @state gamedevelopers - An array of game developers.
     */
    const gamedevelopers = ref<Array<Game.Category>>([]);

    /**
     * @state gameSearchList - Contains the list of searched games and the total count.
     */
    const gameSearchList = ref<Game.GameSearchResponse>({
      list: [],
      total: 0,
    });

    /**
     * @state enterGameItem - Contains data required to enter a game.
     */
    const enterGameItem = ref<Game.GameEnterResponse>({
      method: "",
      parames: "",
      developer: "",
      reserve: "",
      weburl: "",
    });

    /**
     * @state searchGameDialogShow - Controls the visibility of the search game dialog.
     */
    const searchGameDialogShow = ref<boolean>(false);

    /**
     * @state mobileMenuShow - Controls the visibility of the mobile menu.
     */
    const mobileMenuShow = ref<boolean>(true);

    /**
     * @state searchTextList - An array of search terms.
     */
    const searchTextList = ref<Array<string>>([]);

    /**
     * @state gameFilterText - The current text used for filtering games.
     */
    const gameFilterText = ref<string>("");

    /**
     * @state originalGames - An array to store the original list of games.
     */
    const originalGames = ref<Array<Game.Search>>([]);

    /**
     * @state gameHistoryItem - Contains the game history.
     */
    const gameHistoryItem = ref<Game.GameHistoryResponse>({
      total_pages: 0,
      record: [],
    });

    /**
     * @state userSpinPage - Contains data about the user's spin page.
     */
    const userSpinPage = ref<any>({});

    /**
     * @state userSpin - Contains data about the user's spin.
     */
    const userSpin = ref<any>({});

    /**
     * @state language - The current language setting.
     */
    const language = ref<string>(localStorage.getItem("lang") || "en");

    /**
     * @state betby - Stores the betby instance.
     */
    const betby = ref<any>(null);

    /**
     * @state gameBigWinItem - Contains data about big game wins.
     */
    const gameBigWinItem = ref<Game.GameBigWinData>({
      high_rollers: [],
      lucky_bets: [],
    });

    /**
     * @state favoriteGameList - Stores the list of favorite games.
     */
    const favoriteGameList = ref<Array<number | string>>([]);
    var injected: boolean = false;

    // const styles: string = ''
    const scriptSrc: string = "";
    const initializeParams = {};

    // const target = 'bettech'

    var BTRenderer: any = null;
    //  private styleElement: HTMLStyleElement;
    // const initialElement: HTMLMetaElement | null = null
    // const scriptElement: HTMLScriptElement | null = null

    /**
     * @action setSuccess - Sets the success state.
     * @param success - The new success value.
     */
    function setSuccess(_success: boolean) {
      success.value = _success;
    }

    /**
     * @action setErrorMessage - Sets the errMessage state.
     * @param message - The new error message.
     */
    function setErrorMessage(message: string) {
      errMessage.value = message;
    }

    /**
     * @action setGameCategories - Sets the gameCategories state.
     * @param gameCategories - The new game categories.
     */
    function setGameCategories(_gameCategories: Array<Game.Category>) {
      gameCategories.value = _gameCategories;
    }

    /**
     * @action setGamedevelopers - Sets the gamedevelopers state.
     * @param gamedevelopers - The new game developers.
     */
    function setGamedevelopers(_gamedevelopers: Array<Game.Category>) {
      gamedevelopers.value = _gamedevelopers;
    }

    /**
     * @action setGameSearchList - Sets the gameSearchList state.
     * @param gameSearchList - The new game search list.
     */
    function setGameSearchList(_gameSearchList: Game.GameSearchResponse) {
      gameSearchList.value = _gameSearchList;
    }

    /**
     * @action setGameEnterItem - Sets the enterGameItem state.
     * @param enterGameItem - The new game enter item.
     */
    function setGameEnterItem(_enterGameItem: Game.GameEnterResponse) {
      enterGameItem.value = _enterGameItem;
    }

    /**
     * @action setSearchGameDialogShow - Sets the searchGameDialogShow state.
     * @param searchGameDialogShow - The new search game dialog show value.
     */
    function setSearchGameDialogShow(_searchGameDialogShow: boolean) {
      searchGameDialogShow.value = _searchGameDialogShow;
    }

    /**
     * @action setSearchTextList - Adds a search text if not already in the array.
     * @param searchText - The search text to add.
     */
    function setSearchTextList(searchText: string) {
      const sameSearchText = searchTextList.value.filter(
        (item) => item == searchText
      );
      if (sameSearchText.length == 0) {
        searchTextList.value.push(searchText);
      }
    }

    /**
     * @action removeSearchTextList - Removes a search text by index.
     * @param index - The index of the search text to remove.
     */
    function removeSearchTextList(index: number) {
      searchTextList.value.splice(index, 1);
    }

    /**
     * @action removeAllSearchTextList - Removes all search texts.
     */
    function removeAllSearchTextList() {
      searchTextList.value = [];
    }

    /**
     * @action setGameFilterText - Sets the gameFilterText state.
     * @param gameFilterText - The new game filter text.
     */
    function setGameFilterText(_gameFilterText: string) {
      gameFilterText.value = _gameFilterText;
    }

    /**
     * @action setOriginalGames - Sets the originalGames state.
     * @param originalGames - The new original games array.
     */
    function setOriginalGames(_originalGames: Array<Game.Search>) {
      originalGames.value = _originalGames;
    }

    /**
     * @action setMobileMenuShow - Sets the mobileMenuShow state.
     * @param mobileMenuShow - The new mobile menu show value.
     */
    function setMobileMenuShow(_mobileMenuShow: boolean) {
      mobileMenuShow.value = _mobileMenuShow;
    }

    /**
     * @action setGameHistoryItem - Sets the gameHistoryItem state.
     * @param gameHistoryItem - The new game history item.
     */
    function setGameHistoryItem(_gameHistoryItem: Game.GameHistoryResponse) {
      gameHistoryItem.value = _gameHistoryItem;
    }

    /**
     * @action setUserSpinPage - Sets the userSpinPage state.
     * @param userSpinPage - The new user spin page data.
     */
    function setUserSpinPage(_userSpinPage: any) {
      userSpinPage.value = _userSpinPage;
    }

    /**
     * @action setUserSpin - Sets the userSpin state.
     * @param userSpin - The new user spin data.
     */
    function setUserSpin(userSpin: any) {
      userSpin.value = userSpin;
    }

    /**
     * @action setLanguage - Sets the language state.
     * @param lang - The new language.
     */
    function setLanguage(lang: string) {
      language.value = lang;
    }

    /**
     * @action setFavoriteGameList - Sets the favoriteGameList state.
     * @param favoriteGameList - The new favoriteGameList.
     */
    function setFavoriteGameList(_favoriteGameList: Array<number | string>) {
      favoriteGameList.value = _favoriteGameList;
    }

    /**
     * @action openDialog - Opens a dialog, sets the authModalType and authDialogVisible.
     * @param type - The type of the dialog to open.
     */
    function openDialog(type: dialogType) {
      const { setAuthModalType, setAuthDialogVisible } = useAuthStore();
      const { setOverlayScrimShow } = useAppBarStore();
      setAuthModalType(type);
      setAuthDialogVisible(true);
      setOverlayScrimShow(false);
    }

    /**
     * @action closeKill - Calls kill on betby.
     */
    function closeKill() {
      betby.value?.kill();
    }

    /**
     * @action setGameBigWinItem - Sets the gameBigWinItem state.
     * @param gameBigWinItem - The new game big win item.
     */
    function setGameBigWinItem(_gameBigWinItem: Game.GameBigWinData) {
      gameBigWinItem.value = _gameBigWinItem;
    }

    function inject(_gameBigWinItem: Game.GameBigWinData) {
      if (injected) {
        return;
      }

      injected = true;

      // styleElement = document.createElement('style');
      // styleElement.textContent = styles;
      // document.head.appendChild(styleElement);

      var initialElement = document.createElement("meta");
      initialElement.name = "betting-marker";
      initialElement.content = "initial";
      document.head.appendChild(initialElement);

      var scriptElement = document.createElement("script");
      scriptElement.src = scriptSrc;
      scriptElement.async = true;
      document.body.appendChild(scriptElement);

      scriptElement.onload = () => {
        try {
          BTRenderer = new (window as any).BTRenderer().initialize(
            initializeParams
          );
        } catch {
          //   cleanup();
        }
      };
      scriptElement.onabort = () => {};
    }
    /**
     * @action getGameBetbyInit - Gets the betby game init, and sets the callbacks.
     */
    async function getGameBetbyInit() {
      if (!enterGameItem.value.reserve) {
        await dispatchGameEnter({ id: "9999", demo: false });
      }
      betby.value = new BTRenderer().initialize({
        token: enterGameItem.value.reserve || "",
        lang: language,
        target: document.getElementById("betby"),
        brand_id: "2331516940205559808",
        betSlipOffsetTop: 0,
        betslipZIndex: 999,
        themeName: "default",
        onLogin: () => {
          openDialog("login");
        },
        onRegister: () => {
          openDialog("signup");
        },
        onTokenExpired: async () => {
          closeKill();
          await dispatchGameEnter({ id: "9999", demo: false });
          await getGameBetbyInit();
        },
        onSessionRefresh: async () => {
          closeKill();
          await getGameBetbyInit();
        },
      });
    }

    /**
     * @action dispatchGameCategories - Makes a network call to get categories.
     * @param sub_api - The sub api path.
     */
    async function dispatchGameCategories(sub_api: string) {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.GAME_CATEGORY + sub_api;
      const network: Network = Network.getInstance();
      const next = (response: Game.GetGameCategoriesResponse) => {
        if (response.code == 200) {
          setSuccess(true);
          if (sub_api == "?type=developers") {
            setGamedevelopers(response.data);
          } else {
            setGameCategories(response.data);
          }
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, {}, next, 1, 4);
    }

    /**
     * @action dispatchGameSearch - Makes a network call to search for games.
     * @param sub_api - The sub api path.
     */
    async function dispatchGameSearch(sub_api: string) {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.GAME_SEARCH + sub_api;
      const network: Network = Network.getInstance();
      const next = (response: Game.GetGameSearchResponse) => {
        if (response.code == 200) {
          setSuccess(true);
          setGameSearchList(response.data);
          console.log(response.data.list.length);
        } else {
          setGameSearchList({ list: [], total: 0 });
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, {}, next, 1, 4);
    }

    /**
     * @action dispatchUserGame - Makes a network call to get user games.
     * @param data - The request data.
     */
    async function dispatchUserGame(data: Game.GameUserBody) {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.USER_GAME;
      const network: Network = Network.getInstance();
      const next = (response: Game.GetGameSearchResponse) => {
        if (response.code == 200) {
          setSuccess(true);
          setGameSearchList(response.data);
        } else {
          setGameSearchList({ list: [], total: 0 });
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, data, next, 1, 4);
    }

    /**
     * @action dispatchFavoriteGame - Makes a network call to favorite games.
     * @param data - The request data.
     */
    async function dispatchFavoriteGame(data: any) {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.FAVORITE_GAME;
      const network: Network = Network.getInstance();
      const next = (response: any) => {
        if (response.code == 200) {
          setSuccess(true);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, data, next, 1);
    }

    /**
     * @action dispatchGameEnter - Makes a network call to enter game.
     * @param data - The request data.
     */
    async function dispatchGameEnter(data: Game.GameEnterBody) {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.GAME_ENTER;
      const network: Network = Network.getInstance();
      const next = (response: Game.GetGameEnterResponse) => {
        if (response.code == 200) {
          setSuccess(true);
          setErrorMessage("");
          setGameEnterItem(response.data);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, data, next, 1);
    }

    /**
     * @action dispatchGameHistory - Makes a network call to get game history.
     * @param data - The request data.
     */
    async function dispatchGameHistory(data: any) {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.GAME_HISTORY;
      const network: Network = Network.getInstance();
      const next = (response: Game.GetGameHistoryResponse) => {
        if (response.code == 200) {
          setSuccess(true);
          setGameHistoryItem(response.data);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, data, next, 1);
    }

    /**
     * @action dispatchUserSpinPage - Makes a network call to get user spin page.
     * @param data - The request data.
     */
    async function dispatchUserSpinPage(data: any) {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.SPINPAGE;
      const network: Network = Network.getInstance();
      const next = (response: any) => {
        if (response.code == 200) {
          setSuccess(true);
          setUserSpinPage(response.data);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, {}, next, 1, 4);
    }

    /**
     * @action dispatchUserSpin - Makes a network call to get user spin.
     */
    async function dispatchUserSpin() {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.SPIN;
      const network: Network = Network.getInstance();
      const next = (response: any) => {
        if (response.code == 200) {
          setSuccess(true);
          setUserSpin(response.data);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, {}, next, 1);
    }

    /**
     * @action dispatchGameBigWin - Makes a network call to get game big win.
     */
    async function dispatchGameBigWin() {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.GAME_BIGWIN;
      const network: Network = Network.getInstance();
      const next = (response: Game.GetGameBigWinResponse) => {
        if (response.code == 200) {
          setSuccess(true);
          setGameBigWinItem(response.data);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, {}, next, 1, 4);
    }

    /**
     * @action dispatchGameFavoriteList - Makes a network call to get game favorite list.
     */
    async function dispatchGameFavoriteList() {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.GAME_INFO.FAVORITE_GAME_LIST;
      const network: Network = Network.getInstance();
      const next = (response: Game.GetGameFavoriteListResponse) => {
        if (response.code == 200) {
          setSuccess(true);
          setFavoriteGameList(response.data);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, {}, next, 1, 4);
    }

    return {
      success,
      errMessage,
      gameCategories,
      gamedevelopers,
      gameSearchList,
      enterGameItem,
      searchGameDialogShow,
      mobileMenuShow,
      searchTextList,
      gameFilterText,
      originalGames,
      gameHistoryItem,
      userSpinPage,
      userSpin,
      language,
      betby,
      gameBigWinItem,
      favoriteGameList,
      setSuccess,
      setErrorMessage,
      setGameCategories,
      setGamedevelopers,
      setGameSearchList,
      setGameEnterItem,
      setSearchGameDialogShow,
      setSearchTextList,
      removeSearchTextList,
      removeAllSearchTextList,
      setGameFilterText,
      setOriginalGames,
      setMobileMenuShow,
      setGameHistoryItem,
      setUserSpinPage,
      setUserSpin,
      setLanguage,
      setFavoriteGameList,
      openDialog,
      closeKill,
      setGameBigWinItem,
      getGameBetbyInit,
      dispatchGameCategories,
      dispatchGameSearch,
      dispatchUserGame,
      dispatchFavoriteGame,
      dispatchGameEnter,
      dispatchGameHistory,
      dispatchUserSpinPage,
      dispatchUserSpin,
      dispatchGameBigWin,
      dispatchGameFavoriteList,
    };
  },
  {
    persist: true,
  }
);
