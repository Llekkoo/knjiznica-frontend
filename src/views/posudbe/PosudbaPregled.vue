<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const posudba = reactive({
  id: '',
  knjiga_naslov: '',
  clan_ime_prezime: '',
  datum_posudbe: '',
  datum_vracanja: '',
  aktivna: false,
})

async function dohvati() {
  loading.value = true
  const response = await fetch(`${API_URL}/posudbe/${route.params.id}`)
  Object.assign(posudba, await response.json())
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <v-card max-width="600">
    <v-card-title class="d-flex align-center">
      Pregled posudbe
      <v-spacer />
      <v-btn color="primary" @click="router.push(`/posudbe/${posudba.id}/uredi`)">Uredi</v-btn>
    </v-card-title>
    <v-card-text v-if="!loading">
      <p><strong>ID:</strong> {{ posudba.id }}</p>
      <p><strong>Knjiga:</strong> {{ posudba.knjiga_naslov }}</p>
      <p><strong>Član:</strong> {{ posudba.clan_ime_prezime }}</p>
      <p><strong>Datum posudbe:</strong> {{ posudba.datum_posudbe }}</p>
      <p><strong>Datum vraćanja:</strong> {{ posudba.datum_vracanja || '—' }}</p>
      <p><strong>Aktivna:</strong> {{ posudba.aktivna ? 'Da' : 'Ne' }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="router.push('/posudbe')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
