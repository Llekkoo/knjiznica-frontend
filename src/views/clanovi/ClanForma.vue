<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const route = useRoute()
const router = useRouter()
const loading = ref(false)

const clan = reactive({
  ime: '',
  prezime: '',
  email: '',
  telefon: '',
  datum_uclanjenja: '',
})

const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => (jeUredivanje.value ? 'Uredi člana' : 'Dodaj člana'))

async function dohvati() {
  if (!route.params.id) return
  loading.value = true
  const response = await fetch(`${API_URL}/clanovi/${route.params.id}`)
  Object.assign(clan, await response.json())
  loading.value = false
}

async function spremi() {
  loading.value = true
  const url = jeUredivanje.value
    ? `${API_URL}/clanovi/${route.params.id}`
    : `${API_URL}/clanovi`
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clan),
  })
  router.push('/clanovi')
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <v-card max-width="600">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-text-field v-model="clan.ime" label="Ime" />
      <v-text-field v-model="clan.prezime" label="Prezime" />
      <v-text-field v-model="clan.email" label="E-pošta" />
      <v-text-field v-model="clan.telefon" label="Telefon" />
      <v-text-field v-model="clan.datum_uclanjenja" label="Datum učlanjenja (YYYY-MM-DD)" />
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="router.push('/clanovi')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremi">Spremi</v-btn>
    </v-card-actions>
  </v-card>
</template>
