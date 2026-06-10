<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ label: string }>()
const model = defineModel<string>({ default: '' })
const menu = ref(false)
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
  >
    <template #activator="{ props: menuProps }">
      <v-text-field
        v-bind="menuProps"
        :model-value="model"
        :label="label"
        prepend-inner-icon="mdi-calendar"
        append-inner-icon="mdi-menu-down"
        readonly
        clearable
        variant="outlined"
        density="comfortable"
        @click:clear="model = ''"
      />
    </template>
    <v-date-picker
      v-model="model"
      @update:model-value="menu = false"
    />
  </v-menu>
</template>
