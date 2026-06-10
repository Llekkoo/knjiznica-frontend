<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DatePicker from '@/components/DatePicker.vue'
import FormaOmot from '@/components/FormaOmot.vue'
import { API_URL } from '@/config/api'

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
  Object.assign(posudba, await response.json())
  loading.value = false
}

function pripremi() {
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
  const url = jeUredivanje.value ? `${API_URL}/posudbe/${route.params.id}` : `${API_URL}/posudbe`
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pripremi()),
  })
  router.push({
    path: '/posudbe',
    query: { obavijest: jeUredivanje.value ? 'Posudba je ažurirana.' : 'Posudba je dodana.' },
  })
  loading.value = false
}

onMounted(async () => {
  await dohvatiDropdown()
  await dohvati()
})
</script>

<template>
  <FormaOmot
    :naslov="naslov"
    ikona="mdi-book-arrow-right"
  >
    <v-select
      v-model="posudba.knjiga_id"
      :items="knjige"
      item-title="title"
      item-value="value"
      label="Knjiga"
      prepend-inner-icon="mdi-book"
      variant="outlined"
      density="comfortable"
    />
    <v-select
      v-model="posudba.clan_id"
      :items="clanovi"
      item-title="title"
      item-value="value"
      label="Član knjižnice"
      prepend-inner-icon="mdi-account"
      variant="outlined"
      density="comfortable"
    />
    <DatePicker
      v-model="posudba.datum_posudbe"
      label="Datum posudbe"
    />
    <DatePicker
      v-model="posudba.datum_vracanja"
      label="Datum vraćanja"
    />
    <v-switch
      v-model="posudba.aktivna"
      label="Aktivna posudba"
      color="success"
      prepend-icon="mdi-book-check"
      hide-details
    />

    <template #akcije>
      <v-tooltip text="Vrati se na listu">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            prepend-icon="mdi-arrow-left"
            @click="router.push('/posudbe')"
          >
            Odustani
          </v-btn>
        </template>
      </v-tooltip>
      <v-spacer />
      <v-tooltip text="Spremi u bazu">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            :loading="loading"
            prepend-icon="mdi-content-save"
            @click="spremi"
          >
            Spremi
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </FormaOmot>
</template>
