<template>
  <v-dialog v-model="dialogDetail" scrollable max-width="600">
    <v-card>
      <v-toolbar color="primary">
        <span class="headline white--text">{{ detailTitle }}</span>
      </v-toolbar>
      <v-card-text>
        <div class="d-flex align-center py-2">
          <strong class="text-h5 font-weight-bold grey--text">{{ subject }}</strong>
        </div>
        <v-divider></v-divider>
        <div class="text-subtitle-1 font-weight-medium mt-2" v-html="market.ticker"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    marketParam: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      api: {
        ticker: 'https://api.upbit.com/v1/ticker',
      },
      market: {
        ticker: [],
      },
      dialogDetail: false,
      detailTitle: '상세',
      subject: '코인',
    }
  },
  watch: {
    marketParam() {
      if (this.marketParam) {
        this.getDetail()
          .then((response) => {
            this.market.ticker = response
            this.dialogDetail = true
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
  },
  methods: {
    async getDetail() {
      return await this.$axios.$get(`${this.api.ticker}?markets=${this.marketParam}`)
    },
  },
}
</script>
