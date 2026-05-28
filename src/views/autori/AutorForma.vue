<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const route = useRoute()
const router = useRouter()
const loading = ref(false)

const autor = reactive({ ime: '', prezime: '', drzava: '' })
const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => (jeUredivanje.value ? 'Uredi autora' : 'Dodaj autora'))

async function dohvati() {
  if (!route.params.id) return
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/autori/${route.params.id}`)
    Object.assign(autor, await response.json())
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}

async function spremi() {
  loading.value = true
  const url = jeUredivanje.value
    ? `${API_URL}/autori/${route.params.id}`
    : `${API_URL}/autori`
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(autor),
    })
    router.push('/autori')
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <v-card max-width="600">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-text-field v-model="autor.ime" label="Ime" />
      <v-text-field v-model="autor.prezime" label="Prezime" />
      <v-text-field v-model="autor.drzava" label="Država" />
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="router.push('/autori')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremi">Spremi</v-btn>
    </v-card-actions>
  </v-card>
</template>
