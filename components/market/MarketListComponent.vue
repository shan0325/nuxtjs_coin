<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="market.all"
      :items-per-page="100"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="검색은 여기서"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
            @click="showDetail(item.market)"
          >
            <td>{{ item.market }}</td>
            <td>{{ item.korean_name }}</td>
            <td>{{ item.english_name }}</td>
            <td>{{ priceComma(item.detail.trade_price) }}</td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      api: {
        all: 'https://api.upbit.com/v1/market/all',
        ticker: 'https://api.upbit.com/v1/ticker',
      },
      market: {
        all: [],
      },
      headers: [
        { text: 'market', value: 'market' },
        { text: 'korean_name', value: 'korean_name' },
        { text: 'english_name', value: 'english_name' },
        { text: 'trade_price', value: 'trade_price' },
      ],
      search: null,
    }
  },
  created() {
    this.getCoinList()
      .then((response) => {
        if (response) {
          const krwMarks = response
            .filter((res) => res.market.includes('KRW'))
            .map((krw) => {
              krw.detail = {}
              return krw
            })
          this.market.all = krwMarks
          this.disPrice()
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    async getCoinList() {
      return await this.$axios.$get(this.api.all)
    },
    async getCoinPrice(market) {
      const url = `${this.api.ticker}?markets=${market}`
      return await this.$axios.$get(url)
    },
    showDetail(market) {
      this.$emit('showDetailBus', market)
    },
    async disPrice() {
      if (this.market.all) {
        for (let i = 0; i < this.market.all.length; i++) {
          this.getCoinPrice(this.market.all[i].market)
            .then((response) => {
              this.market.all.map((m) => {
                if (m.market === response[0].market) {
                  m.detail = response[0]
                }
                return m
              })
            })
            .catch((error) => {
              console.log(error)
            })
          await this.sleep(300)
        }
      }
      this.disPrice()
    },
    priceComma(price) {
      return price ? Number(price).toLocaleString() : ''
    },
    sleep(ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms))
    },
  },
}
</script>
