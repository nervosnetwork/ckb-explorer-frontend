<template>
  <div class="uk-container">
    <div class="uk-grid">
      <div class="uk-width-1-2 uk-card uk-card-default uk-card-body">
        <h3 class="uk-card-title">Blocks</h3>
        <ul class="uk-list">
          <li class="uk-flex" v-for="block in orderedBlocks" :key="block.header.hash">
            <div class="uk-card uk-card-default uk-card-body uk-width-1-2">
              Block #{{ block.header.number }}
              <div class="uk-text-truncate">
                <router-link v-bind:to="{ name: 'blocks', params: { id: block.header.hash }}">{{ block.header.hash }}</router-link>
              </div>
            </div>
            <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-1-2">
              {{ block.commit_transactions.length }} txns
              <br />
              {{ new Date(block.header.timestamp) | moment("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </li>
        </ul>
      </div>
      <div class="uk-width-1-2 uk-card uk-card-default uk-card-body">
        <h3 class="uk-card-title">Transactions</h3>
        <ul class="uk-list">
          <li class="uk-flex" v-for="tx in transactions" :key="tx.hash">
            <div class="uk-card uk-card-default uk-card-body uk-width-1-1">
              <div class="uk-text-truncate">
                <router-link v-bind:to="{ name: 'transactions', params: { id: tx.hash }}">{{ tx.hash }}</router-link>
              </div>
              <div class="uk-text-truncate">
                Inputs
                <ul>
                  <li v-for="(i, index) in tx.inputs" :key="index">
                    {{ i.previous_output.hash }}
                  </li>
                </ul>
              </div>
              <div class="uk-text-truncate">
                Outputs
              <ul>
                <li v-for="(o, index) in tx.outputs" :key="index">
                  {{ o.lock }}
                </li>
              </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['blocks', 'transactions', 'connect'],

  created () {
    this.connect()
  },

  computed: {
    orderedBlocks: function () {
      return this.blocks.sort(function (a, b) {
        return b.header.number - a.header.number
      })
    }
  }
}

</script>
