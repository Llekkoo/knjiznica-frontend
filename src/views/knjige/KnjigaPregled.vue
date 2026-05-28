<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
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
  <v-card max-width="600">
    <v-card-title class="d-flex align-center">
      Pregled knjige
      <v-spacer />
      <v-btn color="primary" @click="router.push(`/knjige/${knjiga.id}/uredi`)">Uredi</v-btn>
    </v-card-title>
    <v-card-text v-if="!loading">
      <p><strong>ID:</strong> {{ knjiga.id }}</p>
      <p><strong>Naslov:</strong> {{ knjiga.naslov }}</p>
      <p><strong>ISBN:</strong> {{ knjiga.isbn }}</p>
      <p><strong>Godina:</strong> {{ knjiga.godina }}</p>
      <p><strong>Autor:</strong> {{ knjiga.autor_ime_prezime }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="router.push('/knjige')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
