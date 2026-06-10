<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DialogBrisanje from '@/components/DialogBrisanje.vue'
import StranicaKartica from '@/components/StranicaKartica.vue'
import TablicaAkcije from '@/components/TablicaAkcije.vue'
import { API_URL, buildQuery } from '@/config/api'
import { useSnackbar } from '@/composables/useSnackbar'

const router = useRouter()
const route = useRoute()
const { uspjeh } = useSnackbar()
const loading = ref(false)
const prikazi_dialog = ref(false)
const posudbe = ref<any[]>([])
const za_brisanje = ref<any>(null)
const knjige = ref<any[]>([])
const clanovi = ref<any[]>([])
const page = ref(1)
const per_page = ref(10)
const total = ref(0)
const pretraga = ref('')
const filter_knjiga = ref<number | null>(null)
const filter_clan = ref<number | null>(null)
const filter_aktivna = ref<string | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

const statusOpcije = [
  { title: 'Sve posudbe', value: null },
  { title: 'Aktivne', value: 'true' },
  { title: 'Vraćene', value: 'false' },
]

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Knjiga', value: 'knjiga_naslov' },
  { title: 'Član', value: 'clan_ime_prezime' },
  { title: 'Posudba', value: 'datum_posudbe' },
  { title: 'Vraćanje', value: 'datum_vracanja' },
  { title: 'Aktivna', value: 'aktivna' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvati() {
  loading.value = true
  const query = buildQuery({
    page: page.value,
    per_page: per_page.value,
    q: pretraga.value,
    knjiga_id: filter_knjiga.value,
    clan_id: filter_clan.value,
    aktivna: filter_aktivna.value,
  })
  const response = await fetch(`${API_URL}/posudbe${query}`)
  const data = await response.json()
  posudbe.value = data.items
  page.value = data.page
  per_page.value = data.per_page
  total.value = data.total
  loading.value = false
}

async function dohvatiDropdown() {
  const [kRes, cRes] = await Promise.all([
    fetch(`${API_URL}/knjige-dropdown`),
    fetch(`${API_URL}/clanovi-dropdown`),
  ])
  knjige.value = await kRes.json()
  clanovi.value = await cRes.json()
}

function pretraziDebounced() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    page.value = 1
    dohvati()
  }, 350)
}

function promijeniFilter() {
  page.value = 1
  dohvati()
}

async function promijeniOpcije(opcije: any) {
  page.value = opcije.page
  per_page.value = opcije.itemsPerPage
  await dohvati()
}

async function obrisi() {
  if (!za_brisanje.value) return
  loading.value = true
  await fetch(`${API_URL}/posudbe/${za_brisanje.value.id}`, { method: 'DELETE' })
  uspjeh('Posudba je uspješno obrisana.')
  await dohvati()
  loading.value = false
  prikazi_dialog.value = false
}

onMounted(async () => {
  await dohvatiDropdown()
  await dohvati()
  if (route.query.obavijest) {
    uspjeh(String(route.query.obavijest))
    router.replace({ query: {} })
  }
})

watch([filter_knjiga, filter_clan, filter_aktivna], promijeniFilter)
</script>

<template>
  <StranicaKartica
    naslov="Posudbe"
    ikona="mdi-book-arrow-right"
    @dodaj="router.push('/posudbe/dodaj')"
  >
    <div class="filter-box">
      <v-row dense>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="pretraga"
            label="Pretraži posudbe"
            placeholder="Knjiga, član, datum..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            @update:model-value="pretraziDebounced"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="filter_knjiga"
            :items="knjige"
            item-title="title"
            item-value="value"
            label="Filtriraj knjigu"
            prepend-inner-icon="mdi-book"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="filter_clan"
            :items="clanovi"
            item-title="title"
            item-value="value"
            label="Filtriraj člana"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="filter_aktivna"
            :items="statusOpcije"
            item-title="title"
            item-value="value"
            label="Status posudbe"
            prepend-inner-icon="mdi-filter"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="d-flex align-center"
        >
          <v-btn
            variant="tonal"
            block
            prepend-icon="mdi-filter-off"
            @click="pretraga = ''; filter_knjiga = null; filter_clan = null; filter_aktivna = null; promijeniFilter()"
          >
            Očisti filtere
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-data-table-server
      v-model:items-per-page="per_page"
      v-model:page="page"
      :headers="headers"
      :items="posudbe"
      :items-length="total"
      :loading="loading"
      class="tablica-stil"
      hover
      @update:options="promijeniOpcije"
    >
      <template #item.aktivna="{ item }">
        <v-chip
          :color="item.aktivna ? 'success' : 'grey'"
          size="small"
          variant="tonal"
        >
          {{ item.aktivna ? 'Da' : 'Ne' }}
        </v-chip>
      </template>
      <template #item.datum_vracanja="{ item }">
        {{ item.datum_vracanja || '—' }}
      </template>
      <template #item.actions="{ item }">
        <TablicaAkcije
          :on-pregled="() => router.push(`/posudbe/${item.id}`)"
          :on-uredi="() => router.push(`/posudbe/${item.id}/uredi`)"
          :on-obrisi="() => { za_brisanje = item; prikazi_dialog = true }"
        />
      </template>
    </v-data-table-server>
  </StranicaKartica>

  <DialogBrisanje
    v-model="prikazi_dialog"
    poruka="Jeste li sigurni da želite obrisati posudbu?"
    :loading="loading"
    @potvrdi="obrisi"
  />
</template>
