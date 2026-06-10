<script setup lang="ts">
defineProps<{
  onPregled: () => void
  onUredi: () => void
  onObrisi: () => void
}>()
</script>

<template>
  <v-tooltip text="Pregled">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon="mdi-eye"
        size="small"
        variant="text"
        color="primary"
        @click="onPregled"
      />
    </template>
  </v-tooltip>
  <v-tooltip text="Uredi">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon="mdi-pencil"
        size="small"
        variant="text"
        @click="onUredi"
      />
    </template>
  </v-tooltip>
  <v-tooltip text="Obriši">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon="mdi-delete"
        size="small"
        variant="text"
        color="error"
        @click="onObrisi"
      />
    </template>
  </v-tooltip>
</template>
