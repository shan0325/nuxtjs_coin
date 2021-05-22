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
      },
      market: {
        all: [],
      },
      headers: [
        { text: 'market', value: 'market' },
        { text: 'korean_name', value: 'korean_name' },
        { text: 'english_name', value: 'english_name' },
      ],
      search: null,
    }
  },
  created() {
    this.getList()
      .then((response) => {
        if (response) {
          const krwMarks = response.filter((res) => res.market.includes('KRW'))
          this.market.all = krwMarks
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    async getList() {
      return await this.$axios.$get(this.api.all)
    },
    showDetail(market) {
      this.$emit('showDetailBus', market)
    },
  },
}
</script>
