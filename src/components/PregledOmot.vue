<script setup lang="ts">
defineProps<{
  naslov: string
  ikona: string
  loading?: boolean
}>()

const emit = defineEmits<{ uredi: [] }>()
</script>

<template>
  <v-card
    max-width="640"
    class="kartica mx-auto"
    elevation="3"
  >
    <v-card-title class="kartica-naslov d-flex align-center text-white pa-4">
      <v-icon
        :icon="ikona"
        color="accent"
        class="mr-2"
        size="28"
      />
      {{ naslov }}
      <v-spacer />
      <v-tooltip
        text="Uredi zapis"
        location="bottom"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="white"
            variant="flat"
            prepend-icon="mdi-pencil"
            class="text-primary"
            @click="emit('uredi')"
          >
            Uredi
          </v-btn>
        </template>
      </v-tooltip>
    </v-card-title>
    <v-card-text
      v-if="loading"
      class="pa-5"
    >
      <v-progress-linear
        indeterminate
        color="primary"
      />
      <div class="text-center mt-2 text-medium-emphasis">
        Učitavanje...
      </div>
    </v-card-text>
    <v-card-text
      v-else
      class="pa-2"
    >
      <slot />
    </v-card-text>
    <v-divider />
    <v-card-actions class="pa-4 bg-grey-lighten-5">
      <slot name="akcije" />
    </v-card-actions>
  </v-card>
</template>
