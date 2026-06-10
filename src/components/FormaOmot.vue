<script setup lang="ts">
defineProps<{
  naslov: string
  ikona: string
}>()
</script>

<template>
  <v-card
    max-width="640"
    class="kartica mx-auto"
    elevation="3"
  >
    <v-card-title class="kartica-naslov text-white pa-4">
      <v-icon
        :icon="ikona"
        color="accent"
        class="mr-2"
        size="28"
      />
      {{ naslov }}
    </v-card-title>
    <v-card-text class="pa-5">
      <slot />
    </v-card-text>
    <v-divider />
    <v-card-actions class="pa-4 bg-grey-lighten-5">
      <slot name="akcije" />
    </v-card-actions>
  </v-card>
</template>
