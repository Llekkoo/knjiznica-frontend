<script setup lang="ts">
defineProps<{
  poruka: string
  loading?: boolean
}>()

const prikazi = defineModel<boolean>({ default: false })
const emit = defineEmits<{ potvrdi: [] }>()
</script>

<template>
  <v-dialog
    v-model="prikazi"
    max-width="440"
  >
    <v-card
      rounded="lg"
      class="kartica"
    >
      <v-card-title class="d-flex align-center pa-4">
        <v-avatar
          color="error"
          variant="tonal"
          size="40"
          class="mr-3"
        >
          <v-icon icon="mdi-delete-alert" />
        </v-avatar>
        Potvrda brisanja
      </v-card-title>
      <v-card-text class="px-4 pb-2">
        {{ poruka }}
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="tonal"
          @click="prikazi = false"
        >
          Odustani
        </v-btn>
        <v-btn
          color="error"
          :loading="loading"
          prepend-icon="mdi-delete"
          @click="emit('potvrdi')"
        >
          Obriši
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
