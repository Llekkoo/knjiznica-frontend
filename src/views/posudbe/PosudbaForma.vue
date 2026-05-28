<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const knjige = ref<any[]>([])
const clanovi = ref<any[]>([])

const posudba = reactive({
  datum_posudbe: '',
  datum_vracanja: '',
  aktivna: true,
  knjiga_id: '',
  clan_id: '',
})

const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => (jeUredivanje.value ? 'Uredi posudbu' : 'Dodaj posudbu'))

async function dohvatiDropdown() {
  const [kRes, cRes] = await Promise.all([
    fetch(`${API_URL}/knjige-dropdown`),
    fetch(`${API_URL}/clanovi-dropdown`),
  ])
  knjige.value = await kRes.json()
  clanovi.value = await cRes.json()
}

async function dohvati() {
  if (!route.params.id) return
  loading.value = true
  const response = await fetch(`${API_URL}/posudbe/${route.params.id}`)
  const data = await response.json()
  Object.assign(posudba, {
    ...data,
    knjiga_id: data.knjiga_id,
    clan_id: data.clan_id,
  })
  loading.value = false
}

function pripremiPodatke() {
  return {
    datum_posudbe: posudba.datum_posudbe,
    datum_vracanja: posudba.datum_vracanja || null,
    aktivna: posudba.aktivna,
    knjiga_id: Number(posudba.knjiga_id),
    clan_id: Number(posudba.clan_id),
  }
}

async function spremi() {
  loading.value = true
  const url = jeUredivanje.value
    ? `${API_URL}/posudbe/${route.params.id}`
    : `${API_URL}/posudbe`
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pripremiPodatke()),
  })
  router.push('/posudbe')
  loading.value = false
}

onMounted(async () => {
  await dohvatiDropdown()
  await dohvati()
})
</script>

<template>
  <v-card max-width="600">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-select
        v-model="posudba.knjiga_id"
        :items="knjige"
        item-title="title"
        item-value="value"
        label="Knjiga"
      />
      <v-select
        v-model="posudba.clan_id"
        :items="clanovi"
        item-title="title"
        item-value="value"
        label="Član"
      />
      <v-text-field v-model="posudba.datum_posudbe" label="Datum posudbe (YYYY-MM-DD)" />
      <v-text-field v-model="posudba.datum_vracanja" label="Datum vraćanja (opcionalno)" />
      <v-switch v-model="posudba.aktivna" label="Aktivna posudba" color="primary" />
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="router.push('/posudbe')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremi">Spremi</v-btn>
    </v-card-actions>
  </v-card>
</template>
