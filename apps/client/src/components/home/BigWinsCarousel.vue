<script setup>
  import Autoplay from "embla-carousel-autoplay";
  import emblaCarouselVue from "embla-carousel-vue";
  import { onMounted } from "vue";
  import { useGameStore } from "@/stores/game";

  const gameStore = useGameStore();
  const highRollers = gameStore.gameBigWinItem.high_rollers;
  const luckyBets = gameStore.gameBigWinItem.lucky_bets;

  const [emblaRef, emblaApi] = emblaCarouselVue(
    { loop: false, delay: 2000, axis: "y" },
    [Autoplay()]
  );
  const loaded = ref(false);
  const TWEEN_FACTOR_BASE = 0.52;
  let tweenFactor = 0;
  let tweenNodes = [];
  // const bigWins = shopStore.bigWins
  const numberWithinRange = (number, min, max) =>
    Math.min(Math.max(number, min), max);

  function setTweenNodes(emblaApi) {
    if (emblaApi) {
      tweenNodes = emblaApi.slideNodes().map((slideNode) => {
        // return slideNode.querySelector('.embla__slide')
        return slideNode;
      });
    }
  }

  function setTweenFactor(emblaApi) {
    if (emblaApi) {
      tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
    }
  }

  function tweenScale(emblaApi, eventName) {
    if (emblaApi) {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";
      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }
          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor);
          const scale = numberWithinRange(tweenValue, 0, 1).toString();
          const tweenNode = tweenNodes[slideIndex];
          tweenNode.style.transform = `scale(${scale})`;
        });
      });
    }
  }

  function setupTweenScale(emblaApi) {
    if (emblaApi.value) {
      setTweenNodes(emblaApi.value);
      setTweenFactor(emblaApi.value);
      tweenScale(emblaApi.value);

      emblaApi.value
        .on("reInit", setTweenNodes)
        .on("reInit", setTweenFactor)
        .on("reInit", tweenScale)
        .on("scroll", tweenScale)
        .on("slideFocus", tweenScale);

      return () => {
        tweenNodes.forEach((slide) => slide.removeAttribute("style"));
      };
    }
  }
  const duration = ref(100);
  const winList = ref([...highRollers, ...luckyBets]);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  function insert(win) {
    // const i = Math.round(Math.random() * items.value.length)
    const i = 0;
    winList.value.splice(i, 0, win);
  }
  function remove(win) {
    const i = items.value.indexOf(item);
    if (i > -1) {
      items.value.splice(i, 1);
    }
  }
  const items = ref([]);
  // Counter for generating item content
  const itemCount = ref(0);
  // Timer ID for the interval
  let timerId = null;

  // Function to add a new item to the list
  // const addItem = () => {
  //   itemCount.value++
  //   console.log(bigWins[itemCount.value])
  //   winList.value.push(bigWins[itemCount.value])
  // }
  const MAX_ITEMS = 5;

  // Function to add a new item to the list
  const addItem = () => {
    itemCount.value++;
    const newItem = bigWins[itemCount.value];
    console.log(itemCount.value);

    // If the list is already at max length, remove the last item
    // if (winList.value.length >= MAX_ITEMS) {
    //   winList.value.pop() // Remove the last element
    // }

    // Add the new item to the beginning of the list
    winList.value.unshift(newItem);
    if (itemCount.value >= bigWins.length) {
      itemCount.value = 0;
      winList.value = winList.value.slice(1);
    }
  };

  onMounted(async () => {
    // Add the first item immediately
    // if (bigWins.length > 0) {
    //   addItem()
    //   // addItem()
    //   // addItem()
    //   // addItem()
    //   // addItem()
    //   // Set an interval to add a new item every 1000 milliseconds (1 second)
    //   timerId = setInterval(addItem, 1000)
    // }
  });
  onUnmounted(() => {
    if (timerId) {
      clearInterval(timerId);
    }
  });
  // setupTweenScale(emblaApi)
  // if (bigWins.length > 0) {
  //   loaded.value = true
  //   let i = 0
  //   for (var win of bigWins) {
  //     if (i > 4) await delay(2000)
  //     // winList.value.push(win)
  //     insert(win)
  //     if (winList.value.length > 3) {
  //       winList.value.pop()
  //     }
  //     i++
  //   }
  // }
  // console.log(bigWins)
  // duration.value = 80
  // console.log(duration)
</script>

<template>
  <div class="animate__animated animate__fadeIn" style="pointer-events: none">
    <div class="flex bg-transparent bigWins" style="z-index: 0">
      <div
        class="cara rounded-xl py-2 pl-2 w-full min-h-[100%] overflow-hidden z-0 relative"
      >
        <!---->
        <div class="overflow-hidden no-scrollbar">
          <div class="win-feed-group flex flex-row overflow-hidden mx-1">
            <div class="horizontal-list-container">
              <TransitionGroup name="list" tag="div" class="horizontal-list">
                <div v-for="win of winList" :key="win.name" class="list-item">
                  <a
                    href="/casino/blackjack"
                    class="flex flex-col items-center w-20 cursor-pointer hover:brightness-125 win-feed-item"
                    ><div
                      class="w-20 h-[102px] flex items-center justify-center relative animate__animated animate__fadeIn animate__faster"
                    >
                      <img
                        height="102"
                        :src="`/images/games/${win.developer}/${win}.avif`"
                        class="rounded-md h-[102px]"
                        alt="casino game"
                        fetchpriority="high"
                        loading="eager"
                      /><!---->
                    </div>
                    <div class="w-full text-2xs leading-4">
                      <div
                        class="flex items-center justify-center flex-nowrap gap-1 font-semibold"
                      >
                        <div
                          class="flex-none flex items-center text-primitives-light-blue-500"
                        >
                          <!-- <span class="nuxt-icon nuxt-icon--fill" width="12" height="12"
                        ><svg
                          width="24"
                          height="24"
                          viewBox="0 0 96 96"
                          fill="odd"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M44 12h8v9h-8v-9zm0 65h8v9h-8v-9zM32.37 39.5c0-7.4 7.26-13.5 16.06-13.5 11.13 0 15.47 6.35 16.54 11.27l-7.2 2.11c-.47-2.74-2.94-6.78-9.27-6.78-4.8 0-8.13 2.99-8.13 6.35 0 2.8 1.86 4.91 5.53 5.66l6.8 1.31c8.33 1.56 12.8 6.47 12.8 12.7C65.5 65.46 59.56 72 48.76 72c-12 0-17.52-7.22-18.26-13.57l7.47-2c.46 4.61 4 8.85 10.8 8.85 5.66 0 8.6-2.68 8.6-6.1 0-2.87-2.27-5.17-6.34-5.98l-6.66-1.3c-7.2-1.37-12-5.8-12-12.4z"
                          />
                        </svg>
                      </span> -->
                          <!-- 18 -->
                          <div
                            class="justify-between flex flex-row items-center align-center"
                          >
                            <div
                              class="rounded-full h-[100px]"
                              style="
                                height: 30px;
                                width: 30px;
                                z-index: -2;
                                left: 0px;
                                margin-left: -14px;
                                margin-top: 0px;
                                background-size: 100%;
                                border-radius: 999px;
                                background-position: center;
                                background-repeat: no-repeat;
                              "
                              :style="`background-image: url('/images/avatars/${win.avatar}');`"
                            />
                            <div class="flex-0" style="width: 2px"></div>
                            <span
                              class="flex-1 text-neutral-50 truncate"
                              style="font-size: 13px"
                              >{{ win.user_name }}</span
                            >
                          </div>
                        </div>
                      </div>
                      <div
                        class="w-full font-mono font-normal text-[#59D48F] text-center"
                        style="font-size: 12px"
                      >
                        {{ win.amount }} USD
                      </div>
                    </div>
                  </a>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @charset "UTF-8";

  /* Container for the horizontal list */
  .horizontal-list-container {
    position: relative;
    z-index: 0;
    width: 100%;
    margin-left: 120px;
    max-width: 100vw; /* Optional: limit max width */
    /* Center the container */
    overflow: hidden; /* Enable horizontal scrolling if items exceed width */
    padding-bottom: 5px; /* Add padding for potential scrollbar */
    box-sizing: border-box;
  }

  /* The flex container for the items */
  .horizontal-list {
    display: flex; /* Arrange items horizontally */
    padding: 0 10px; /* Padding inside the list */
    /* Ensure the list doesn't wrap */
    flex-wrap: nowrap;
  }

  /* Individual list item styling */
  .list-item {
    position: relative;
    background-color: rgba(98, 10, 133, 0.4);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(98, 10, 133, 0.6);
    flex-shrink: 0; /* Prevent items from shrinking */
    padding: 2px 5px;
    /* background-color: #3b82f6; */
    color: white;
    border-radius: 5px;
    min-width: 80px; /* Minimum width for items */
    text-align: center;
    margin-left: 10px;
  }

  /* --- Transition Group Animations --- */
  /* Apply transition to moving elements */
  .list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  /* Initial state for entering elements (enter from the left) */
  .list-enter-from {
    opacity: 1;
    scale: 0;
    transform: scaleY(1) translateX(-120px); /* Enter from the left */
  }

  /* Final state for leaving elements (leave to the right) */
  .list-leave-to {
    opacity: 1;
    transform: scaleY(0.01) translateX(120px, -120px);
    /* opacity: 0;
  transform: translateX(30px); Leave to the right */
  }

  /* Ensure leaving elements are removed from the flow */
  .list-leave-active {
    /* position: absolute; */
    /* Needed to prevent the element from affecting layout during transition */
  }
  /* .gradient-box {
  display: flex;
  align-items: center;
  width: 100%;
  margin: auto;
  max-width: 22em;
  position: relative;
  padding: 30% 2em;
  box-sizing: border-box;
  color: #fff;
  background: #000;
  background-clip: padding-box;
  border: solid 5px transparent;
  border-radius: 1em;
}
.gradient-box:before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  margin: -5px;
  border-radius: inherit;
  background: linear-gradient(to right, red, orange);
} */
  .cara {
    -webkit-text-size-adjust: 100%;
    font-feature-settings: normal;
    font-variation-settings: normal;
    tab-size: 4;
    -webkit-tap-highlight-color: transparent;
    --form-input-height: 36px;
    --form-checkbox-size: 18px;
    color-scheme: dark;
    --nav-height: 60px;
    --bottom-nav-height: 76px;
    --vertical-nav-width: 280px;
    --color-primary-50: 231 255 230;
    --color-primary-100: 203 254 201;
    --color-primary-200: 155 252 154;
    --color-primary-300: 95 247 97;
    --color-primary-400: 37 235 42;
    --color-primary-500: 16 210 24;
    --color-primary-600: 8 168 17;
    --color-primary-700: 11 128 20;
    --color-primary-800: 9 98 11;
    --color-primary-900: 18 85 25;
    --color-primary-950: 4 47 10;
    --color-primary-green: 37 235 42;
    --color-primary-orange: 252 121 32;
    --color-primary-blue-light: 79 160 255;
    --color-primary-blue: 28 132 255;
    --color-primary-blue-medium: 17 56 102;
    --color-primary-blue-darker: 22 32 44;
    --color-primary-red: 229 10 48;
    --color-primary-pink: 221 0 152;
    --color-primary-purple: 130 0 255;
    --color-primary-strong: 77 75 83;
    --color-gray-0: 245 245 245;
    --color-gray-25: 226 226 226;
    --color-gray-50: 176 172 183;
    --color-gray-75: 146 146 146;
    --color-gray-100: 87 85 94;
    --color-gray-200: 87 85 94;
    --color-gray-300: 74 73 80;
    --color-gray-400: 62 60 68;
    --color-gray-500: 52 50 57;
    --color-gray-600: 44 42 50;
    --color-gray-610: 77 75 83;
    --color-gray-700: 37 35 41;
    --color-gray-800: 29 28 31;
    --color-gray-900: 23 22 26;
    --color-gray-950: 18 17 20;
    --color-gray-975: 27 26 30;
    --color-gray-1000: 10 10 10;
    --color-primary-DEFAULT: var(--color-primary-400);
    line-height: inherit;
    font-family:
      Inter,
      system-ui,
      BlinkMacSystemFont,
      -apple-system,
      Fira Sans,
      Droid Sans,
      Helvetica Neue,
      sans-serif;
    -webkit-font-smoothing: antialiased;
    --tw-border-spacing-x: 0;
    --tw-border-spacing-y: 0;
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    --tw-pan-x: ;
    --tw-pan-y: ;
    --tw-pinch-zoom: ;
    --tw-scroll-snap-strictness: proximity;
    --tw-gradient-from-position: ;
    --tw-gradient-via-position: ;
    --tw-gradient-to-position: ;
    --tw-ordinal: ;
    --tw-slashed-zero: ;
    --tw-numeric-figure: ;
    --tw-numeric-spacing: ;
    --tw-numeric-fraction: ;
    --tw-ring-inset: ;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgba(30, 148, 223, 0.5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;
    --tw-blur: ;
    --tw-brightness: ;
    --tw-contrast: ;
    --tw-grayscale: ;
    --tw-hue-rotate: ;
    --tw-invert: ;
    --tw-saturate: ;
    --tw-sepia: ;
    --tw-drop-shadow: ;
    --tw-backdrop-blur: ;
    --tw-backdrop-brightness: ;
    --tw-backdrop-contrast: ;
    --tw-backdrop-grayscale: ;
    --tw-backdrop-hue-rotate: ;
    --tw-backdrop-invert: ;
    --tw-backdrop-opacity: ;
    --tw-backdrop-saturate: ;
    --tw-backdrop-sepia: ;
    --tw-contain-size: ;
    --tw-contain-layout: ;
    --tw-contain-paint: ;
    --tw-contain-style: ;
    border-color: rgb(var(--color-gray-200) / 1);
    border-style: solid;
    border-width: 0;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    min-height: 142px;
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
    --tw-bg-opacity: 1;
    /* background-color: rgb(29 28 31 / var(--tw-bg-opacity, 1)); */
    padding-bottom: 0.1rem;
    padding-top: 0.5rem;
    padding-left: 0.5rem;
  }
  .gradient-border-mask {
    display: block;
    position: relative;
    padding: 2px;
    max-width: 600px;
    /* -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px); */
  }

  .gradient-border-mask::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 45px;
    border: 5px solid transparent;
    background: linear-gradient(to right, red, orange) border-box;
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }

  .bigwin {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    max-width: 22em;

    pointer-events: none;
    font-family:
      Roboto,
      ui-sans-serif,
      system-ui,
      sans-serif,
      Apple Color Emoji,
      Segoe UI Emoji,
      Segoe UI Symbol,
      Noto Color Emoji;
    font-feature-settings: normal;
    margin-bottom: 3px;
    font-variation-settings: normal;
    border-width: 0;
    border-style: solid;
    border-image-slice: 7 12 14 5;
    border-color: rgba(var(--gray-200));
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--gray-700) / 0.3) transparent;
    background-image: linear-gradient(
      68deg,
      #da0000,
      #fe5000 22%,
      #fe8c00 84%,
      #fff800
    );
    height: 50px;
    border-radius: 9999px;
    padding: 0.125rem;
    .rounded-full {
      border-radius: 9999px;
    }
    .h-\[30px\] {
      height: 30px;
    }
    .bg-gradient-orange-red {
      background-image: linear-gradient(68.3deg, #f5b161 0.4%, #ec366e 100.2%);
    }
    * {
      scrollbar-width: thin;
      scrollbar-color: rgb(var(--gray-700) / 0.3) transparent;
    }
    * {
      box-sizing: border-box;
    }
    *,
    :after,
    :before {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
      border-color: rgba(var(--gray-200));
    }
  }
  @font-face {
    font-family: knight;
    src:
      local("Pixel"),
      url("/Kanit-ExtraBold.ttf") format("truetype");
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .knight {
    font-family: "knight", serif;
  }

  .bigWins {
    /* margin: 1rem;
  padding-bottom: 30px; */
    display: flex;
    justify-content: end;
    align-items: center;
    overflow: hidden;
    /* background-image: url('/images/ads/promo-dock.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom; */
  }

  .embla {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
    /* margin-left: 36px;
  margin-right: 36px; */
  }
</style>
