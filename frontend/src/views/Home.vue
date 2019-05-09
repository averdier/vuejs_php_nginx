<template>
  <v-layout v-if="status === 'loading'" justify-center align-center fill-height>
     <v-flex text-xs-center>
            <v-progress-circular indeterminate></v-progress-circular>
        </v-flex>
  </v-layout>

  <v-layout v-else-if="status === 'error'" justify-center align-center fill-height>
      <v-flex text-xs-center shrink>
          <v-icon large>error</v-icon>
          <p class="mt-2">Something goes wrong</p>
      </v-flex>
  </v-layout>

  <v-list v-else-if="status === 'success'" two-line style="width: 100%">
    <v-list-tile v-for="item in items" :key="item.id">

          <v-list-tile-avatar>
              <img src="@/assets/elo_user.png" alt="avatar">
          </v-list-tile-avatar>

          <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.description }}</v-list-tile-sub-title>
          </v-list-tile-content>

      </v-list-tile>
  </v-list>

</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState({
      status: state => state.resources.status,
      items: state => state.resources.items
    }),
    created () {
      this.$store.dispatch('resources/getItems')
    }
  }
</script>
