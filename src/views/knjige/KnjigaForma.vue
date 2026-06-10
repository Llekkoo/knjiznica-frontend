<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormaOmot from '@/components/FormaOmot.vue'
import { API_URL } from '@/config/api'

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

async function dohvati() {
  if (!route.params.id) return
  loading.value = true
  const response = await fetch(`${API_URL}/knjige/${route.params.id}`)
  Object.assign(knjiga, await response.json())
  loading.value = false
}

function pripremi() {
  return {
    naslov: knjiga.naslov,
    isbn: knjiga.isbn,
    godina: knjiga.godina === '' ? null : Number(knjiga.godina),
    autor_id: knjiga.autor_id === '' ? null : Number(knjiga.autor_id),
  }
}

async function spremi() {
  loading.value = true
  const url = jeUredivanje.value ? `${API_URL}/knjige/${route.params.id}` : `${API_URL}/knjige`
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pripremi()),
  })
  router.push({
    path: '/knjige',
    query: { obavijest: jeUredivanje.value ? 'Knjiga je ažurirana.' : 'Knjiga je dodana.' },
  })
  loading.value = false
}

onMounted(async () => {
  await dohvatiAutore()
  await dohvati()
})
</script>

<template>
  <FormaOmot
    :naslov="naslov"
    ikona="mdi-book"
  >
    <v-text-field
      v-model="knjiga.naslov"
      label="Naslov knjige"
      prepend-inner-icon="mdi-book-open-page-variant"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="knjiga.isbn"
      label="ISBN"
      prepend-inner-icon="mdi-barcode"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="knjiga.godina"
      label="Godina izdanja"
      type="number"
      prepend-inner-icon="mdi-calendar"
      variant="outlined"
      density="comfortable"
    />
    <v-select
      v-model="knjiga.autor_id"
      :items="autori"
      item-title="title"
      item-value="value"
      label="Autor"
      prepend-inner-icon="mdi-account-edit"
      variant="outlined"
      density="comfortable"
      clearable
    />

    <template #akcije>
      <v-tooltip text="Vrati se na listu">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            prepend-icon="mdi-arrow-left"
            @click="router.push('/knjige')"
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
