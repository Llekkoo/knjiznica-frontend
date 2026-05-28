<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const autor = reactive({ id: '', ime: '', prezime: '', drzava: '' })

async function dohvati() {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/autori/${route.params.id}`)
    Object.assign(autor, await response.json())
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <v-card max-width="600">
    <v-card-title class="d-flex align-center">
      Pregled autora
      <v-spacer />
      <v-btn color="primary" @click="router.push(`/autori/${autor.id}/uredi`)">Uredi</v-btn>
    </v-card-title>
    <v-card-text v-if="!loading">
      <p><strong>ID:</strong> {{ autor.id }}</p>
      <p><strong>Ime:</strong> {{ autor.ime }}</p>
      <p><strong>Prezime:</strong> {{ autor.prezime }}</p>
      <p><strong>Država:</strong> {{ autor.drzava }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="router.push('/autori')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
