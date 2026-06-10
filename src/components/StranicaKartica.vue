<script setup lang="ts">
defineProps<{
  naslov: string
  ikona: string
}>()

const emit = defineEmits<{ dodaj: [] }>()
</script>

<template>
  <v-card
    class="kartica"
    elevation="2"
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
        text="Dodaj novi zapis"
        location="bottom"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="white"
            variant="flat"
            prepend-icon="mdi-plus"
            class="text-primary"
            @click="emit('dodaj')"
          >
            Dodaj
          </v-btn>
        </template>
      </v-tooltip>
    </v-card-title>
    <v-card-text class="pa-4">
      <slot />
    </v-card-text>
  </v-card>
</template>
