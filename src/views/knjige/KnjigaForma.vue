<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const autori = ref<any[]>([])

const knjiga = reactive({ naslov: '', isbn: '', godina: '', autor_id: '' })
const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => (jeUredivanje.value ? 'Uredi knjigu' : 'Dodaj knjigu'))

async function dohvatiAutore() {
  const response = await fetch(`${API_URL}/autori-dropdown`)
  autori.value = await response.json()
}

async function dohvatiKnjigu() {
  if (!route.params.id) return
  loading.value = true
  const response = await fetch(`${API_URL}/knjige/${route.params.id}`)
  Object.assign(knjiga, await response.json())
  loading.value = false
}

function pripremiPodatke() {
  return {
    naslov: knjiga.naslov,
    isbn: knjiga.isbn,
    godina: knjiga.godina === '' ? null : Number(knjiga.godina),
    autor_id: knjiga.autor_id === '' ? null : Number(knjiga.autor_id),
  }
}

async function spremi() {
  loading.value = true
  const url = jeUredivanje.value
    ? `${API_URL}/knjige/${route.params.id}`
    : `${API_URL}/knjige`
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pripremiPodatke()),
  })
  router.push('/knjige')
  loading.value = false
}

onMounted(async () => {
  await dohvatiAutore()
  await dohvatiKnjigu()
})
</script>

<template>
  <v-card max-width="600">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-text-field v-model="knjiga.naslov" label="Naslov" />
      <v-text-field v-model="knjiga.isbn" label="ISBN" />
      <v-text-field v-model="knjiga.godina" label="Godina izdanja" type="number" />
      <v-select
        v-model="knjiga.autor_id"
        :items="autori"
        item-title="title"
        item-value="value"
        label="Autor"
        clearable
      />
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="router.push('/knjige')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremi">Spremi</v-btn>
    </v-card-actions>
  </v-card>
</template>
