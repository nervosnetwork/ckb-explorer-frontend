<template>
  <table class="uk-table">
    <caption>Block #{{ block.header.number }}</caption>
    <tbody>
        <tr>
          <td>Hash</td>
          <td>#{{ block.hash }}</td>
        </tr>
        <tr>
          <td>Pre Hash</td>
          <td><router-link v-bind:to="{ name: 'blocks', params: { id: block.header.parent_hash }}">{{ block.header.parent_hash}}</router-link></td>
        </tr>
        <tr>
          <td>Timestamp</td>
          <td>{{ new Date(block.header.timestamp) | moment("YYYY-MM-DD HH:mm:ss") }}</td>
        </tr>
        <tr>
          <td>Height</td>
          <td>{{ block.header.number }}</td>
        </tr>
        <tr>
          <td>Transactions Commit</td>
          <td>{{ block.header.txs_commit }}</td>
        </tr>
        <tr>
          <td>Difficulty</td>
          <td>{{ block.header.difficulty }}</td>
        </tr>
        <tr>
          <td>Challenge</td>
          <td>{{ block.header.challenge }}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['block', 'get_block'],

  created () {
    this.get_block(this.$route.params.id)
  },

  beforeRouteUpdate (to, from, next) {
    this.get_block(to.params.id)
  }
}
</script>
