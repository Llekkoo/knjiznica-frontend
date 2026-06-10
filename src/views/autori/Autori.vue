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
const autori = ref<any[]>([])
const za_brisanje = ref<any>(null)
const page = ref(1)
const per_page = ref(10)
const total = ref(0)
const pretraga = ref('')
const filter_drzava = ref<string | null>(null)
const drzave = ref<any[]>([])
let timer: ReturnType<typeof setTimeout> | null = null

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Ime', value: 'ime' },
  { title: 'Prezime', value: 'prezime' },
  { title: 'Država', value: 'drzava' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvati() {
  loading.value = true
  const query = buildQuery({
    page: page.value,
    per_page: per_page.value,
    q: pretraga.value,
    drzava: filter_drzava.value,
  })
  const response = await fetch(`${API_URL}/autori${query}`)
  const data = await response.json()
  autori.value = data.items
  page.value = data.page
  per_page.value = data.per_page
  total.value = data.total
  loading.value = false
}

async function dohvatiDrzave() {
  const response = await fetch(`${API_URL}/drzave-dropdown`)
  drzave.value = await response.json()
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
  await fetch(`${API_URL}/autori/${za_brisanje.value.id}`, { method: 'DELETE' })
  uspjeh('Autor je uspješno obrisan.')
  await dohvati()
  loading.value = false
  prikazi_dialog.value = false
}

onMounted(async () => {
  await dohvatiDrzave()
  await dohvati()
  if (route.query.obavijest) {
    uspjeh(String(route.query.obavijest))
    router.replace({ query: {} })
  }
})

watch(filter_drzava, promijeniFilter)
</script>

<template>
  <StranicaKartica
    naslov="Autori"
    ikona="mdi-account-edit"
    @dodaj="router.push('/autori/dodaj')"
  >
    <div class="filter-box">
      <v-row dense>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="pretraga"
            label="Pretraži autore"
            placeholder="Ime, prezime, država..."
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
            v-model="filter_drzava"
            :items="drzave"
            item-title="title"
            item-value="value"
            label="Filtriraj državu"
            prepend-inner-icon="mdi-earth"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
          class="d-flex align-center"
        >
          <v-tooltip text="Očisti filtere">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="tonal"
                block
                prepend-icon="mdi-filter-off"
                @click="pretraga = ''; filter_drzava = null; promijeniFilter()"
              >
                Očisti
              </v-btn>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>

    <v-data-table-server
      v-model:items-per-page="per_page"
      v-model:page="page"
      :headers="headers"
      :items="autori"
      :items-length="total"
      :loading="loading"
      class="tablica-stil"
      hover
      @update:options="promijeniOpcije"
    >
      <template #item.actions="{ item }">
        <TablicaAkcije
          :on-pregled="() => router.push(`/autori/${item.id}`)"
          :on-uredi="() => router.push(`/autori/${item.id}/uredi`)"
          :on-obrisi="() => { za_brisanje = item; prikazi_dialog = true }"
        />
      </template>
    </v-data-table-server>
  </StranicaKartica>

  <DialogBrisanje
    v-model="prikazi_dialog"
    poruka="Jeste li sigurni da želite obrisati autora?"
    :loading="loading"
    @potvrdi="obrisi"
  />
</template>
