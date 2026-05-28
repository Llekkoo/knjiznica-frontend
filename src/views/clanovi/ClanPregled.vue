<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const clan = reactive({
  id: '',
  ime: '',
  prezime: '',
  email: '',
  telefon: '',
  datum_uclanjenja: '',
})

async function dohvati() {
  loading.value = true
  const response = await fetch(`${API_URL}/clanovi/${route.params.id}`)
  Object.assign(clan, await response.json())
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <v-card max-width="600">
    <v-card-title class="d-flex align-center">
      Pregled člana
      <v-spacer />
      <v-btn color="primary" @click="router.push(`/clanovi/${clan.id}/uredi`)">Uredi</v-btn>
    </v-card-title>
    <v-card-text v-if="!loading">
      <p><strong>ID:</strong> {{ clan.id }}</p>
      <p><strong>Ime:</strong> {{ clan.ime }}</p>
      <p><strong>Prezime:</strong> {{ clan.prezime }}</p>
      <p><strong>E-pošta:</strong> {{ clan.email }}</p>
      <p><strong>Telefon:</strong> {{ clan.telefon }}</p>
      <p><strong>Datum učlanjenja:</strong> {{ clan.datum_uclanjenja }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="router.push('/clanovi')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
