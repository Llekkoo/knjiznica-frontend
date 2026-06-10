<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PregledOmot from '@/components/PregledOmot.vue'
import { API_URL } from '@/config/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const autor = reactive({ id: '', ime: '', prezime: '', drzava: '' })

async function dohvati() {
  loading.value = true
  const response = await fetch(`${API_URL}/autori/${route.params.id}`)
  Object.assign(autor, await response.json())
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <PregledOmot
    naslov="Pregled autora"
    ikona="mdi-account-edit"
    :loading="loading"
    @uredi="router.push(`/autori/${autor.id}/uredi`)"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-identifier">
        <v-list-item-title>ID</v-list-item-title>
        <v-list-item-subtitle>{{ autor.id }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-account">
        <v-list-item-title>Ime</v-list-item-title>
        <v-list-item-subtitle>{{ autor.ime }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-account-outline">
        <v-list-item-title>Prezime</v-list-item-title>
        <v-list-item-subtitle>{{ autor.prezime }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-earth">
        <v-list-item-title>Država</v-list-item-title>
        <v-list-item-subtitle>{{ autor.drzava || '—' }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <template #akcije>
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/autori')"
      >
        Natrag
      </v-btn>
    </template>
  </PregledOmot>
</template>
