<template>
  <div class="animated fadeIn">
    <h2 class="color-rw-primary">Claim Vested RWRD Tokens</h2>
    <b-row class="mt-3">
      <b-col md="8">
        <div class="form-group">
          <label class="control-label">Your Wallet Address</label>
          <input type="text" class="form-control active-border" v-model="coinbase"/>
        </div>
      </b-col>
      <b-col md="4">
        <b-button class="btn btn-success mt-b" @click="loadInfo">Load Vested Info</b-button>
      </b-col>
    </b-row>
    <div class="claim-status active-border">
      <div v-if="vestedAmount > 0">
        <b-row class="mt-3">
          <b-col md="4">
            <p class="my-0">Total Amounts: {{vestedAmount}}
              <small class="text-muted">RWRDs</small>
            </p>
          </b-col>
          <b-col md="4">
            <p class="my-0">Transferred Amounts: {{transferredTokens}}
              <small class="text-muted">RWRDs</small>
            </p>
          </b-col>
        </b-row>
        <hr>
        <b-row v-if="level === 1">
          <b-col md="4">
            <p class="my-0">Vesting Start : {{vestingStart}}</p>
          </b-col>
          <b-col md="4">
            <p class="my-0">Vesting Cliff : {{vestingCliff}} hrs</p>
          </b-col>
          <b-col md="4">
            <p class="my-0">Vesting Duration : {{vestingDuration}} hrs</p>
          </b-col>
        </b-row>
        <div class="mt-3" v-else>
          <b-row v-for="(item, index) in scheduleTimes" :key="index">
            <b-col md="4"><p class="my-0">Vesting Time : {{item}}</p></b-col>
            <b-col md="4">
              <p class="my-0">Vesting Amount : {{scheduleValues[index]}}
                <small class="text-muted">RWRDs</small>
              </p>
            </b-col>
          </b-row>
        </div>
        <b-row class="mt-5">
          <b-col md="12">
            <p>
              Claim Available Token Amounts: {{transferableTokens}}
              <small class="text-muted">RWRDs</small>
              &nbsp;&nbsp;&nbsp;({{rangeCurrentTime}})
            </p>
            <div class="mt-3 color-rw-error" ref="refCurrentTime">{{rangeCurrentTime}}</div>
            <input type="range" :min="rangeMin" :max="rangeMax" v-model="rangeCurrent"
                          id="range-input"/>
            <div class="color-rw-primary range-bottom">
              <p class="float-left">{{rangeMinTime}}</p>
              <p class="float-right">{{rangeMaxTime}}</p>
              <div v-for="(rule, index) in rules" :key="index">
                <span class="rule" :style="{marginLeft: rule + '%'}" :class="{'current': index === rules.length-1}"></span>
              </div>
            </div>
          </b-col>
        </b-row>
        <p class="color-rw-error">* Note: All time values are evaluated by UTC (<span
          style="font-style: italic">{{dateFormat}}</span>)</p>
        <b-row class="mt-5">
          <b-col md="12">
            <b-button class="btn btn-success" @click="claimTokens">Claim Vested Tokens</b-button>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <div>No Vested Tokens</div>
      </div>
    </div>
    <b-row class="mt-5">
      <b-col md="6">
        <span class="left-header color-rw-primary">Token Contract</span>
        <b-row>
          <b-col md="12">
            <p class="text-muted float-left m-0 py-2">{{tokenAddress}}</p>
            <b-button variant="link" class="px-0 color-rw-active float-right"
                      @click="copyTokenABI">Copy ABI
            </b-button>
          </b-col>
        </b-row>
        <pre id="token_abi_source" class="active-border" v-html="tokenABI"></pre>
      </b-col>
      <b-col md="6">
        <span class="left-header color-rw-primary">Vesting Contract</span>
        <b-row>
          <b-col md="12">
            <p class="text-muted float-left m-0 py-2">{{vestingAddress}}</p>
            <b-button variant="link" class="px-0 color-rw-active float-right"
                      @click="copyVestingABI">Copy ABI
            </b-button>
          </b-col>
        </b-row>
        <pre id="vesting_abi_source" class="active-border" v-html="vestingABI"></pre>
      </b-col>
    </b-row>

    <h3 class="color-rw-primary mt-5">How it works</h3>
    <hr>
    <div class="mt-3">
      <h5 class="mb-2 color-rw-primary">Option A - Claim Rewards Tokens using this tool and a Metamask Wallet</h5>
      <p>Step 1: Enter your wallet address in the tool and press <strong>Load Vested Info</strong>.</p>
      <p>Step 2: Make sure you have Metamask installed and opened with some Ethereum on the Metamask wallet address.
        Metamask is a Google Chrome extension that you can download in the Chrome store and set up using the
        instructions they provide on their website.</p>
      <p>Step 3: Press <strong>Claim Vested Tokens</strong>.</p>
      <p>Step 4: A Metamask window will pop up asking you to confirm the transaction. The default gas fees are fine. If
        you have sufficient Ether to cover this transaction it should go through.</p>
    </div>
    <hr>
    <div class="mt-3">
      <h5 class="mb-2 color-rw-primary">Option B - Claim Rewards tokens using MyEtherWallet (Supports Ledger Nano S,
        Private Key, TREZOR and many other wallets)</h5>
      <p>Step 1: Enter your wallet address in the tool and press <strong>Load Vested Info</strong>.</p>
      <p> Step 2: Open MyEtherWallet and click on the <strong>Contracts</strong> tab.</p>
      <p>Step 3: Insert <strong>Vesting Address</strong> from this tool to the <strong>Contract
        Address</strong> field on MyEtherWallet. Insert <strong>Vesting Contract ABI</strong> from this tool to the
        <strong>ABI / JSON Interface</strong> field in MyEtherWallet.</p>
      <p>Step 4: Click the blue <strong>Access</strong> button and then under the Read/Write section click on the grey
        button and choose the <strong>claim</strong> function</p>
      <p>Step 5: Insert <strong>Token Address</strong> from this tool to the <strong>token address</strong> field in
        MyEtherWallet.</p>
      <p>Step 6: IThen choose your wallet type from the list under <strong>How would you like to access your
        wallet?</strong></p>
      <p>Step 7: Press <strong>Connect to…</strong> & Press <strong>Write</strong></p>
      <p>Step 8: If the gas limit section is blank then set it to 100000</p>
      <p>Step 9: Press <strong>Generate Transaction</strong></p>
      <p>Step 10: Press <strong>Yes, I am sure. Make transaction.</strong></p>
      <p>Step 11: Then continue with completing the transfer. This will vary depending on the type of wallet you used to
        set up your vesting contract.</p>
    </div>
    <b-modal id="vesting_modal" hide-header hide-footer no-close-on-backdrop centered
             v-model="modalShow"
    >
      <h3 class="mb-4">Claim Vested Tokens</h3>
      <b-row>
        <b-col md="12">
          <p>
            The transaction in progress.
            <i class="fa ml-3"
               :class="{
               'fa-spinner fa-spin color-rw-active' : transactionInProgress,
               'fa-check-circle-o color-rw-active' : !transactionInProgress && !transactionError,
               'fa-time color-rw-error' : transactionError}"
               style="font-size: 20px"></i>
          </p>
          <p class="text-muted">It will take 1 ~ 5 minutes to be fully executed. If time is over, you must check the
            transaction manually.</p>
          <div v-show="transactionError">
            <p>{{transactionError}}</p>
          </div>
          <div v-show="!transactionInProgress && !transactionError">
            <p>The transaction was successfully executed.</p>
            <p>Please check your wallet to confirm received Tokens</p>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-btn variant="link" class="color-rw-primary float-right"
                 style="font-size: 16px" @click="modalShow = !modalShow">
            Close
          </b-btn>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import Utils from "../../utils/contract";
  import VestingVault from "../artifacts/VestingVault";
  import Token from "../artifacts/RewardsToken";

  export default {
    name: "claim",

    computed: mapState({
      coinbase: state => state.web3.coinbase,
      vestingAddress: state => state.rewards.vestingContractAddress,
      tokenAddress: state => state.rewards.tokenContractAddress
    }),

    data() {
      return {
        vestedAmount: null,
        vestingStart: null,
        vestingCliff: null,
        vestingDuration: null,
        scheduleTimes: [],
        scheduleValues: [],
        level: null,
        transferredTokens: null,
        transferableTokens: null,
        rangeMin: null,
        rangeMax: null,
        rangeCurrent: null,
        rangeMinTime: null,
        rangeMaxTime: null,
        rangeCurrentTime: null,
        tokenABI: Token.abi,
        vestingABI: VestingVault.abi,
        modalShow: false,
        transactionInProgress: true,
        transactionError: null,
        dateFormat: 'DD-MM-YYYY HH:mm',
        rules: []
      }
    },

    methods: {
      initialModal() {
        this.modalShow = true;
        this.transactionInProgress = true;
        this.transactionError = null;
      },
      finalizeModal() {
        this.transactionInProgress = false;
      },
      errorModal(error) {
        this.transactionInProgress = false;
        this.transactionError = error;
      },
      loadInfo() {
        let vm = this;
        let currentTime = Math.round((new Date()).getTime() / 1000);
        Utils.handler(VestingVault.abi, vm.vestingAddress).then(controller => {
          controller.handler.returnGrantInfo(vm.coinbase, (error, result) => {
            if (!error) {
              let rules = [];
              vm.vestedAmount = Math.round(Number(result[0]) / Math.pow(10, 18));
              vm.vestingStart = moment.unix(Number(result[1])).format(vm.dateFormat);
              vm.vestingCliff = Number(result[2]) / 3600;
              vm.vestingDuration = Number(result[3]) / 3600;
              vm.rangeMin = Number(result[1]);
              vm.rangeMax = Number(result[1]) + Number(result[3]);
              rules.push(Number(result[1]) + Number(result[2]));
              if (result[4].length > 0) {
                vm.scheduleTimes = [];
                vm.scheduleValues = [];
                rules = [];
                for (let i = 0; i < result[4].length; i++) {
                  vm.scheduleTimes.push(moment.unix(Number(result[4][i])).format(vm.dateFormat));
                  vm.scheduleValues.push(Math.round(Number(result[5][i]) / Math.pow(10, 18)));
                  rules.push(Number(result[4][i]));
                }
                vm.rangeMin = Number(result[4][0]);
                vm.rangeMax = Number(result[4][result[4].length - 1]);
              }

              vm.rangeMin = vm.rangeMin > currentTime ? currentTime : vm.rangeMin;
              vm.rangeMax = vm.rangeMax < currentTime ? currentTime : vm.rangeMax;
              vm.rangeMin = vm.rangeMin - 10000;
              vm.rangeMax = vm.rangeMax + 10000;
              vm.rangeMinTime = moment.unix(vm.rangeMin).format(vm.dateFormat);
              vm.rangeMaxTime = moment.unix(vm.rangeMax).format(vm.dateFormat);

              vm.level = Number(result[6]);
              vm.transferredTokens = Math.round(Number(result[7]) / Math.pow(10, 18));

              vm.$nextTick(function () {
                vm.rangeCurrent = currentTime;
                vm.rangeCurrentTime = moment.unix(currentTime).format(vm.dateFormat);
                rules.push(currentTime);
                vm.displayCurrentTime();
                vm.generateRules(rules);
                vm.getAvailableAmounts();
              });
            }
          });
        });
      },
      claimTokens() {
        let vm = this;
        this.initialModal();
        Utils.handler(VestingVault.abi, vm.vestingAddress).then(controller => {
          controller.handler.claim(controller.base, (error, result) => {
            if (!error) {
              let log = controller.handler.NewRelease();
              log.watch(function (error, res) {
                if (!error) {
                  console.log(res);
                  vm.finalizeModal();
                  vm.loadInfo();
                }
              })
            } else {
              vm.errorModal(error.message);
            }
          });
        });
      },
      getAvailableAmounts() {
        let vm = this;
        Utils.handler(VestingVault.abi, vm.vestingAddress).then(controller => {
          controller.handler.transferableTokens(vm.coinbase, vm.rangeCurrent, (error, result) => {
            if (!error) {
              let transferableTokens = Math.round(Number(result) / Math.pow(10, 18) - vm.transferredTokens);
              vm.transferableTokens = transferableTokens > 0 ? transferableTokens : 0;
            }
          });
        });
      },
      generateRules (values) {
        let vm = this;
        this.rules = [];
        values.forEach((value) => {
          let percent = 100 * (value - vm.rangeMin) / (vm.rangeMax - vm.rangeMin);
          vm.rules.push(percent);
        })
      },
      displayCurrentTime() {
        let vm = this;
        let rangeElement = vm.$refs.refCurrentTime;
        let percent = 100 * (vm.rangeCurrent - vm.rangeMin) / (vm.rangeMax - vm.rangeMin);
        if (percent < 85) {
          rangeElement.style.marginLeft = percent + "%";
        }
      },
      copyTokenABI() {
        let copyText = window.document.getElementById("token_abi_source").textContent;
        let textArea = document.createElement('textarea');
        textArea.textContent = copyText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        this.$notify({
          group: 'notification-br',
          type: 'success',
          text: 'Successfully copied RewardsToken ABI !'
        });
      },
      copyVestingABI() {
        let copyText = window.document.getElementById("vesting_abi_source").textContent;
        let textArea = document.createElement('textarea');
        textArea.textContent = copyText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        this.$notify({
          group: 'notification-br',
          type: 'success',
          text: 'Successfully copied VestingVault ABI !'
        })
      },
    },

    watch: {
      rangeCurrent(value) {
        this.rangeCurrentTime = moment.unix(value).format(this.dateFormat);
        this.displayCurrentTime();
      },
      rangeCurrentTime: _.debounce(function () {
        this.getAvailableAmounts();
      }, 250)
    }
  }
</script>

<style scoped>
  .left-header {
    font-size: 20px;
  }

  .claim-status {
    padding: 30px;
  }

  .range-bottom {
    position: relative;
  }

  .rule {
    position: absolute;
    display: block;
    width: 3px;
    height: 24px;
    top: -22px;
    background: #aeaeae;
    border-radius: 5px;
    z-index: -100;
  }
  .rule.current {
    background: #4dbc74;
  }

  #range-input {
    box-shadow: none;
    width: 100%;
  }

  #token_abi_source, #vesting_abi_source {
    max-height: 200px;
    background: white;
  }

  .active-border {
    border: 1px solid #4dbc74;
  }
</style>
