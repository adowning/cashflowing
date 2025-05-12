<!-- eslint-disable ts/ban-ts-comment -->
<script lang="ts" setup>
  // import { useOperatorStore } from '@/stores/operator'
  import { useUserStore } from "@/stores/user";
  import { useDepositStore } from "@/stores/deposit";
  import { currency } from "@/utils/currency";
  // import { AppLauncher } from '@capacitor/app-launcher'
  import { nextTick, onMounted, ref } from "vue";
  import type { Transaction } from "@cashflow/types";

  const eventBus = useEventManager();

  const depositStore = useDepositStore();
  const userStore = useUserStore();
  // const shopStore = useOperatorStore()
  // const shop = shopStore.currentShop
  const currentUser = userStore.getCurrentUser;
  const _cashtag = ref();
  const changeStores = ref(false);
  const storeId = ref();
  const operatorData = depositStore.getOperatorData;
  // if (operatorData === undefined) return
  // if (currentUser === undefined) return
  const showKeyboard = ref(false);
  if (currentUser?.cashtag !== undefined) {
    _cashtag.value = currentUser.cashtag;
  }
  if (operatorData?.id !== undefined) {
    storeId.value = operatorData.id;
  }
  const errorMsg = ref("");
  const value = ref<any>([]);
  const badTag = ref(false);
  const badStore = ref(false);
  const paymentMethodCorrect = ref(false);
  const method = ref();
  const _cashtag_field = ref("");
  function priceFormatted(price: number) {
    return currency(price, "en-US", { currency: "USD" });
  }

  async function setCashtag(val: string) {
    // const tmp_cashtag = val.substring('$', '')
    //   const check = await checkCashtag(accessToken.value, val)
    // const check: any = await userStore.dispatchUserCashtag(
    //     val
    // )
    // // console.log(check)
    // if (check === 'invalid tag') {
    //   badTag.value = true
    //   errorMsg.value = 'Unable to verify cashtag'
    // }
    // if (check === 'cashtag in use') {
    //   badTag.value = true
    //   errorMsg.value = 'Cashtag in use'
    // // }
    // if (badTag.value) {
    //   setTimeout(() => {
    //     badTag.value = false
    //     _cashtag_field.value = ''
    //     errorMsg.value = ''
    //   }, 3000)
    // } else {
    // const updatedUser = await updateUserCashtag(accessToken.value, val)
    const updatedUser: any = await userStore.dispatchUserCashtag(val);

    _cashtag_field.value = "";
    errorMsg.value = "";
    _cashtag.value = updatedUser.cashtag;
    // router.push('/shop')
    eventBus.emit("activeName", "confirmPayment");
    // }
    //#27787-b
    method.value = 0;
  }
  async function setStore(_val: any) {
    const val = _val.join(``);
    //   const store = await findStoreByCode(accessToken.value, val)
    const store: any = await api.shopController.send({ data: val });

    // queryClient.invalidateQueries({ queryKey: ['userInfo'] })

    if (store === "unable to find shop") {
      badStore.value = true;
      errorMsg.value = "Unable to verify store";
    }
    if (store === "already in shop") {
      badStore.value = true;
      errorMsg.value = "already in shop";
    }
    if (store === "already active shop") {
      badStore.value = true;
      errorMsg.value = "already active shop";
    }
    //   else {
    //     const updatedUser = await updateUserCashtag(accessToken.value, val)
    //     //console.log(updatedUser)
    //     _storeId_field.value = ''
    //     errorMsg.value = ''
    //     _cashtag.value = updatedUser.cashtag

    //   }
    if (badStore.value) {
      setTimeout(() => {
        badStore.value = false;
        value.value = [];
        window.focus();
        errorMsg.value = "";
      }, 3000);
      return;
    }
    // @ts-ignore
    // paymentMethods.value = store.acceptedPaymentMethods
    if (paymentMethods.value.includes(props.paymentMethod)) {
      paymentMethodCorrect.value = true;
    } else {
      paymentMethodCorrect.value = false;
    }
    method.value = 0;
  }
  async function checkCanOpenUrl() {
    const { value } = await AppLauncher.canOpenUrl({
      url: "com.squareup.cash",
    });
    // console.log('Can open url: ', value)
  }

  async function confirm(method: string) {
    // console.log(method)
    const data: Partial<Transaction> = {
      type: "DEPOSIT",
      // channel: method.toLowerCase() === 'cashapp' ? 'CASHAPP' : 'INSTORE',
      amount: depositStore.getSelectedProduct?.priceInCents,
      amountCredits: depositStore.getSelectedProduct?.amountToReceiveInCredits,
      buyerCashtag: currentUser?.cashtag,
      // userAvatar: currentUser.avatar,
      username: currentUser?.username,
      // bonusType: depositStore.getSelectedProduct?.bonusType,
      cashierAvatar: "",
      cashiername: "",
      buyerUserId: currentUser?.id,
      cashierId: "",
      status: "PENDING",
      productid: depositStore.getSelectedProduct?.id,
      // @ts-ignore
      // selectedProduct: state.value.selectedProduct,
      shopId: store.shop.activeProfile.shopId,
    };
    if (method === "CASHAPP") {
      data.paymentMethod = "CASHAPP";
    }

    if (method === "INSTORE") {
      data.paymentMethod = "INSTORE";
    }
    data.productid = depositStore.getSelectedProduct?.id;

    //   const balanceTransaction = await createbalanceTransaction(accessToken.value, data)
    const tran = await api.transactionControllerCreate.send({ data });
    await depositStore.dispatchUserDepositSubmit(data);
    // const sse = await api.transactionSseControllerCreate({ body: tran })
    // console.log(tran)
    // //console.log(sse)
    // await transactionStore.dispatchGetTransactions()
    if (method === "CASHAPP") {
      checkCanOpenUrl();
    }
    // queryClient.invalidateQueries({ queryKey: ['user'] })

    // //console.log('tick')
    // target!.value!.classList.add(`animate__animated`, 'animate__bounceOut')
    nextTick(() => {
      // console.log('nextTick callback')
      eventBus.emit("activeName", "none");
      // $bus.$emit(eventTypes.setPending)
      // $bus.$emit(eventTypes.closeShop)
    });
  }

  onMounted(async () => {
    // console.log(state.value.shop.acceptedPaymentMethods)
    // //console.log(state.value.shop.paymentMethod)
    // paymentMethods = state.value.shop.acceptedPaymentMethods/
    if (
      store.shop.acceptedPaymentMethods.includes(
        store.shop.selectedPaymentMethod
      )
    ) {
      paymentMethodCorrect.value = true;
    }
  });
</script>

<template>
  <div
    class="flex flex-col items-end justify-between"
    style="min-height: 400px"
  >
    <div v-if="store.shop.selectedPaymentMethod === 'CASHAPP'">
      <div v-if="_cashtag == null || _cashtag === undefined || _cashtag === ''">
        <div class="mx-auto mt-6 flex flex-col justify-center">
          <h3
            id="words"
            class="glow text-small mb-2 w-full px-6 text-white"
            style="font-size: 24px"
          >
            Enter the cashtag your deposit will be coming from
          </h3>
          <div
            v-if="badTag"
            style="
              color: red;
              font-size: 18px;
              font-weight: 600;
              margin: auto;
              padding-bottom: 4px;
            "
          >
            {{ errorMsg }}
          </div>
          <div
            v-else
            style="
              color: red;
              font-size: 18px;
              font-weight: 600;
              margin: auto;
              padding-bottom: 4px;
            "
          >
            &nbsp;
          </div>
          <!-- <FormField
            v-model="_cashtag_field"
            :disabled="badTag"
            class="flex justify-center bg-black"
            minlength="4"
            maxlength="10"
            style="
              /* font-size: 38px;
              background-color: black;
              border-style: solid;
              border-radius: 15px;
              border-color: white;
              border-width: 2px;
              width: 50vw;
              margin: auto; */
            "
          > -->
          <input
            v-else
            :id="id"
            ref="inputEl"
            v-model="_cashtag_field"
            :name="name"
            :maxlength="maxlength"
            :inputmode="inputmode"
            :autocomplete="autocomplete"
            :required="required"
            :placeholder="placeholder"
            :type="computedType"
            :class="inputElClass"
            class="futex-cell-3 mt-12"
            style="
              font-size: 28px;
              color: white;
              padding: 8px;
              background-color: black;
              border-style: solid;
              border-radius: 10px;
              border-color: white;
              border-width: 1px;
              width: 70vw;
              margin: auto;
              margin-top: 12px;
            "
          />
          <!-- <FormControl v-model="_cashtag_field" /> -->
          <!-- </FormField> -->
          <!-- <GlassButton
            :disabled="_cashtag_field.length < 4"
            title="Submit"
            color="green"
            class="hind-guntur-semibold pa-0 ma-0"
            style="
              line-height: 1.2;
              padding-bottom: 1px;
              margin: auto;
              margin-bottom: 120px;
              margin-top: 16px;
            "
            @click="_cashtag_field.length > 4 ? setCashtag(_cashtag_field) : ''"
          >
            SUBMIT
          </GlassButton> -->
        </div>
        <div
          class="mx-16 mb-12 flex flex-row justify-center"
          style="margin-bottom: 150px; margin-top: 16px"
        >
          <div @click="setCashtag(_cashtag_field)">
            <GlassButton
              :disabled="_cashtag_field.length < 4 || badTag === true"
              color="green"
            >
              Submit
            </GlassButton>
          </div>
        </div>
      </div>

      <div
        v-if="
          store.shop.selectedPaymentMethod === 'INSTORE' &&
          storeId !== null &&
          paymentMethods.includes('cashapp') &&
          paymentMethodCorrect === true
        "
        class="flex flex-col justify-start"
      >
        <div
          style="
            background-image: url(&quot;/images/cell_noglow_trans.avif&quot;);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            border-image-slice: 60px 60px fill;
            border-image-repeat: space;
            border-image-width: 22px;
            width: 80vw;
            height: 100px;
          "
        >
          <div class="glow m-auto flex p-3">
            Once submitted the order will remain pending until a cashier at the
            store confirms payment
          </div>
        </div>
        <div
          class="margin-auto mx-3 flex flex-row justify-start pt-2 text-align-center"
          style="
            height: 80px;
            background: url(&quot;/images/input.avif&quot;) no-repeat;
            background-size: 100% 100%;
            background-position: center;
            padding: 18px;
          "
        >
          <div
            class="h-100 flex flex-row items-center justify-between pt-5 text-align-center"
            style="margin: auto"
          >
            <img
              src="/images/shop/shopcoin.avif"
              color="green"
              style="color: white; width: 35px; height: 35px"
            />
            <div
              class="bungee mt-0"
              style="font-weight: 700; font-size: x-large; color: white"
            >
              <h4 class="bungee" style="font-size: x-large">
                &nbsp;&nbsp;{{ selectedProduct.coins }}
              </h4>
            </div>

            <div class="flex grow-1" style="width: 15px" />
            <div />
            <img
              src="/images/shop/shoparrow.avif"
              color="green"
              style="width: 20px; height: 20px"
            />
            <div color="green" style="width: 15px; font-weight: 700" />
            <div
              class="mt-0 text-align-center"
              style="font-weight: 700; font-size: x-large; color: white"
            >
              {{ currentUser.username }}
            </div>
          </div>
        </div>
        <h3
          class="margin-auto mb-2 text-center text-white"
          style="font-size: 18px; font-weight: 500"
        >
          Amount due:
        </h3>
        <div>
          <h1
            class="margin-auto glow mb-2 text-center text-white"
            style="font-size: 32px"
          >
            ${{ selectedProduct.price / 100 }}.00
          </h1>
        </div>
        <div
          class="margin-auto mb-12 mt-4 w-100% flex flex-row justify-center"
          style="
            margin: auto;
            margin-bottom: 89px;
            margin-top: 16px;
            width: 100%;
            justify-content: center;
            height: 40px;
          "
        >
          <div @click="confirm('CASHAPP')">
            <GlassButton color="green">
              Confirm
              <span class="loading loading-spinner loading-lg" />
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="
        store.shop.selectedPaymentMethod === 'CASHAPP' &&
        _cashtag !== null &&
        paymentMethods.includes('CASHAPP')
      "
      class="flex flex-col"
    >
      <div class="glow-light">Click confirm to be taken to cashapp</div>
      <div
        class="margin-auto mx-3 flex flex-row justify-start pt-2 text-align-center"
        style="
          height: 80px;
          background: url(&quot;/images/input.avif&quot;) no-repeat;
          background-size: 100% 100%;
          background-position: center;
          padding: 18px;
        "
      >
        <div
          class="flex flex-row items-center justify-between pt-1 text-align-center"
          style="margin: auto"
        >
          <img
            src="/images/shop/shopcoin.avif"
            color="green"
            style="color: white; width: 35px; height: 35px"
          />
          <div
            class="bungee mt-0"
            style="font-weight: 700; font-size: x-large; color: white"
          >
            <h4 class="bungee" style="font-size: x-large">
              &nbsp;&nbsp;{{
                store.shop.selectedProduct.amountToReceiveInCredits
              }}
            </h4>
          </div>

          <div class="flex grow-1" style="width: 15px" />
          <div />
          <img
            src="/images/shop/shoparrow.avif"
            color="green"
            style="width: 20px; height: 20px"
          />
          <div color="green" style="width: 15px; font-weight: 700" />
          <div
            class="mt-0 text-align-center"
            style="font-weight: 700; font-size: x-large; color: white"
          >
            {{ currentUser.username }}
          </div>
        </div>
      </div>
      <h3
        class="margin-auto mt-2 text-center text-white"
        style="font-size: 18px; font-weight: 500"
      >
        Amount due:
      </h3>
      <div>
        <h1
          class="margin-auto glow my-1 text-center text-white"
          style="font-size: 32px"
        >
          {{ priceFormatted(store.shop.selectedProduct.priceInCents / 100) }}
        </h1>
      </div>
      <div
        class="margin-auto mb-12 mt-3 w-100% flex flex-row justify-center"
        style="
          margin: auto;
          margin-bottom: 89px;
          margin-top: 16px;
          width: 100%;
          justify-content: center;
          height: 40px;
        "
      >
        <div
          class="flex flex-col gap-3 color-white"
          @click="confirm('cashapp')"
        >
          <GlassButton
            color="green"
            style="
              margin: auto;
              margin-bottom: 12px;
              max-width: 130px;
              font-size: 24px;
              font-weight: 700;
            "
          >
            Confirm
            <span class="loading loading-spinner loading-lg" />
          </GlassButton>
          <div
            class="flex text-center color-gray-400"
            style="
              line-height: 1;
              font-size: 15px;
              font-weight: 700;
              margin: auto;
              width: 80vw;
            "
          >
            <span
              >Purchase will be applied to the account with cashtag
              <span style="color: white">${{ currentUser.cashtag }}</span></span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="store.shop.selectedPaymentMethod === 'INSTORE'">
      <div
        v-if="
          storeId == null ||
          storeId.length === 0 ||
          storeId === undefined ||
          (changeStores === true && paymentMethodCorrect === false)
        "
      >
        <div class="mx-auto flex flex-col justify-start">
          <h3
            v-if="changeStores === false"
            id="words"
            class="glow text-small mb-2 w-full text-pretty text-white"
            style="font-size: 24px"
          >
            Cannot find a store associated with this account. <br />Please enter
            a valid store id
          </h3>
          <h3
            v-if="changeStores === true"
            id="words"
            class="glow text-small mb-2 w-full text-pretty text-white"
            style="font-size: 24px"
          >
            <br />Please enter a valid store id
          </h3>
          <div
            v-if="badStore"
            style="
              color: red;
              font-size: 18px;
              font-weight: 600;
              margin: auto;
              padding-bottom: 4px;
            "
          >
            {{ errorMsg }}
          </div>
          <div
            v-else
            style="
              color: red;
              font-size: 18px;
              font-weight: 600;
              margin: auto;
              padding-bottom: 4px;
            "
          >
            &nbsp;
          </div>
          <!-- <Input
            :disabled="badStore"
            v-model="_storeId_field"
            label="Cashtag"
            class="flex justify-center bg-black"
            minlength="4"
            maxlength="10"
            style="
              font-size: 18px;
              background-color: black;
              border-style: solid;
              border-radius: 10px;
              border-color: white;
              border-width: 1px;
              width: 50vw;
              margin: auto;
            "
          >

        </Input> -->
          <div class="m-auto flex" />
          <div class="m-auto flex">
            <FormField
              v-model="passwordValue"
              :value="value.join('')"
              :gutter="15"
              :focused="showKeyboard"
              @focus="showKeyboard = true"
              @complete="setStore(value)"
            >
              <FormControl
                v-model="passwordValue"
                type="password"
                :icon="mdiMail"
              />
            </FormField>
          </div>
          <!-- <GlassButton
            :disabled="_cashtag_field.length < 4"
            title="Submit"
            color="green"
            class="hind-guntur-semibold pa-0 ma-0"
            style="
              line-height: 1.2;
              padding-bottom: 1px;
              margin: auto;
              margin-bottom: 120px;
              margin-top: 16px;
            "
            @click="_cashtag_field.length > 4 ? setCashtag(_cashtag_field) : ''"
          >
            SUBMIT
          </GlassButton> -->
        </div>
        <!-- <div
          v-if="storeId !== undefined && storeId !== ''"
          class="mb-12 mx-16 flex flex-row justify-center"
          style="margin-bottom: 150px; margin-top: 16px"
        >
          <GlassButton
            :disabled="storeId.length < 4 || badStore === true"
            color="green"
            style="
              padding-left: 22px;
              padding-right: 22px;
              font-weight: 800;
              font-size: x-large;
              color: white;
            "
            type="submit"
            @click="setStore(storeId)"
          >
            Submit
            <span class="loading loading-spinner loading-lg"></span>
          </GlassButton>
        </div> -->
      </div>
      <div
        v-if="
          store.shop.selectedPaymentMethod === 'INSTORE' &&
          storeId !== null &&
          changeStores === false &&
          !paymentMethods.includes('INSTORE') &&
          paymentMethodCorrect === false
        "
      >
        <div class="mx-auto flex flex-col justify-start">
          <h3
            id="words"
            class="glow text-small mb-2 w-full text-pretty text-white"
            style="font-size: 24px"
          >
            Your current active store/agent does not accept in store payments.
            Do you want to change your active store to a new store?
          </h3>

          <!-- <GlassButton
            :disabled="_cashtag_field.length < 4"
            title="Submit"
            color="green"
            class="hind-guntur-semibold pa-0 ma-0"
            style="
              line-height: 1.2;
              padding-bottom: 1px;
              margin: auto;
              margin-bottom: 120px;
              margin-top: 16px;
            "
            @click="_cashtag_field.length > 4 ? setCashtag(_cashtag_field) : ''"
          >
            SUBMIT
          </GlassButton> -->
        </div>
        <div
          class="mx-16 mb-12 flex flex-row justify-center gap-3"
          style="margin-bottom: 150px; margin-top: 16px"
        >
          <div @click="$bus.$emit(eventTypes.shop_next, 'selectPayment')">
            <GlassButton
              :disabled="storeId.length < 4 || badStore === true"
              color="red"
            >
              No
            </GlassButton>
          </div>
          <div @click="changeStores = true">
            <GlassButton
              :disabled="storeId.length < 4 || badStore === true"
              color="green"
            >
              Yes
            </GlassButton>
          </div>
        </div>
      </div>
      <div
        v-if="
          store.shop.selectedPaymentMethod === 'INSTORE' &&
          storeId !== null &&
          paymentMethods.includes('INSTORE') &&
          paymentMethodCorrect === true
        "
        class="flex flex-col justify-start"
      >
        <!-- <div class="futex-cell"> -->
        <div class="futex-cell">
          Once submitted the order will remain pending until a cashier at the
          store confirms payment
        </div>
        <!-- </div> -->
        <div
          class="margin-auto mx-3 flex flex-row justify-start pt-2 text-align-center"
          style="
            height: 80px;
            background: url(&quot;/images/input.avif&quot;) no-repeat;
            background-size: 100% 100%;
            background-position: center;
            padding: 18px;
          "
        >
          <div
            class="h-100 flex flex-row items-center justify-between pt-5 text-align-center"
            style="margin: auto"
          >
            <img
              src="/images/shop/shopcoin.avif"
              color="green"
              style="color: white; width: 35px; height: 35px"
            />
            <div
              class="bungee mt-0"
              style="font-weight: 700; font-size: x-large; color: white"
            >
              <h4 class="bungee" style="font-size: x-large">
                &nbsp;&nbsp;{{ selectedProduct.coins }}
              </h4>
            </div>

            <div class="flex grow-1" style="width: 15px" />
            <div />
            <img
              src="/images/shop/shoparrow.avif"
              color="green"
              style="width: 20px; height: 20px"
            />
            <div color="green" style="width: 15px; font-weight: 700" />
            <div
              class="mt-0 text-align-center"
              style="font-weight: 700; font-size: x-large; color: white"
            >
              {{ currentUser.username }}
            </div>
          </div>
        </div>
        <h3
          class="margin-auto mb-2 text-center text-white"
          style="font-size: 18px; font-weight: 500"
        >
          Amount due:
        </h3>
        <div>
          <h1
            class="margin-auto glow mb-2 text-center text-white"
            style="font-size: 32px"
          >
            ${{ selectedProduct.price }}
          </h1>
        </div>
        <div
          class="margin-auto mb-12 mt-4 w-100% flex flex-row justify-center"
          style="
            margin: auto;
            margin-bottom: 89px;
            margin-top: 16px;
            width: 100%;
            justify-content: center;
            height: 40px;
          "
        >
          <div @click="confirm('INSTORE')">
            <GlassButton color="green">
              Confirm
              <span class="loading loading-spinner loading-lg" />
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div v-if="badTag" class="mx-auto">
    <span class="glow-light"> Unable to verify cashtag, please try again</span>
    <div inset>
      <Input
        v-model="_cashtag_field"
        label="Cashtag"
        class="glow justify-center bg-black"
        center
        minlength="4"
        maxlength="10"
        label-width="80px"
        label-align="left"
        style="
          font-size: 18px;
          background-color: black;
          border-style: solid;
          border-radius: 10px;
          border-color: white;
          border-width: 1px;
        "
      >
        <template #button>
          <GlassButton
            :disabled="_cashtag_field.length < 4"
            title="Submit"
            color="green"
            class="hind-guntur-semibold pa-0 ma-0"
            style="line-height: 1.2; padding-bottom: 1px"
            @click="_cashtag_field.length > 4 ? setCashtag(_cashtag_field) : ''"
          >
            SUBMIT
          </GlassButton>
        </template>
</Input>
</div>
</div> -->
</template>
