<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PregledOmot from '@/components/PregledOmot.vue'
import { API_URL } from '@/config/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const knjiga = reactive({
  id: '',
  naslov: '',
  isbn: '',
  godina: '',
  autor_ime_prezime: '',
})

async function dohvati() {
  loading.value = true
  const response = await fetch(`${API_URL}/knjige/${route.params.id}`)
  Object.assign(knjiga, await response.json())
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <PregledOmot
    naslov="Pregled knjige"
    ikona="mdi-book"
    :loading="loading"
    @uredi="router.push(`/knjige/${knjiga.id}/uredi`)"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-identifier">
        <v-list-item-title>ID</v-list-item-title>
        <v-list-item-subtitle>{{ knjiga.id }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-book-open-page-variant">
        <v-list-item-title>Naslov</v-list-item-title>
        <v-list-item-subtitle>{{ knjiga.naslov }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-barcode">
        <v-list-item-title>ISBN</v-list-item-title>
        <v-list-item-subtitle>{{ knjiga.isbn || '—' }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-calendar">
        <v-list-item-title>Godina</v-list-item-title>
        <v-list-item-subtitle>{{ knjiga.godina || '—' }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-account-edit">
        <v-list-item-title>Autor</v-list-item-title>
        <v-list-item-subtitle>{{ knjiga.autor_ime_prezime || '—' }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <template #akcije>
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/knjige')"
      >
        Natrag
      </v-btn>
    </template>
  </PregledOmot>
</template>
