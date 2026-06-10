<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
const clanovi = ref<any[]>([])
const za_brisanje = ref<any>(null)
const page = ref(1)
const per_page = ref(10)
const total = ref(0)
const pretraga = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Ime', value: 'ime' },
  { title: 'Prezime', value: 'prezime' },
  { title: 'E-pošta', value: 'email' },
  { title: 'Telefon', value: 'telefon' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvati() {
  loading.value = true
  const query = buildQuery({
    page: page.value,
    per_page: per_page.value,
    q: pretraga.value,
  })
  const response = await fetch(`${API_URL}/clanovi${query}`)
  const data = await response.json()
  clanovi.value = data.items
  page.value = data.page
  per_page.value = data.per_page
  total.value = data.total
  loading.value = false
}

function pretraziDebounced() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    page.value = 1
    dohvati()
  }, 350)
}

async function promijeniOpcije(opcije: any) {
  page.value = opcije.page
  per_page.value = opcije.itemsPerPage
  await dohvati()
}

async function obrisi() {
  if (!za_brisanje.value) return
  loading.value = true
  await fetch(`${API_URL}/clanovi/${za_brisanje.value.id}`, { method: 'DELETE' })
  uspjeh('Član je uspješno obrisan.')
  await dohvati()
  loading.value = false
  prikazi_dialog.value = false
}

onMounted(async () => {
  await dohvati()
  if (route.query.obavijest) {
    uspjeh(String(route.query.obavijest))
    router.replace({ query: {} })
  }
})
</script>

<template>
  <StranicaKartica
    naslov="Članovi"
    ikona="mdi-account-group"
    @dodaj="router.push('/clanovi/dodaj')"
  >
    <div class="filter-box">
      <v-row dense>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="pretraga"
            label="Pretraži članove"
            placeholder="Ime, prezime, email..."
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
          md="6"
          class="d-flex align-center"
        >
          <v-btn
            variant="tonal"
            block
            prepend-icon="mdi-filter-off"
            @click="pretraga = ''; page = 1; dohvati()"
          >
            Očisti pretragu
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-data-table-server
      v-model:items-per-page="per_page"
      v-model:page="page"
      :headers="headers"
      :items="clanovi"
      :items-length="total"
      :loading="loading"
      class="tablica-stil"
      hover
      @update:options="promijeniOpcije"
    >
      <template #item.actions="{ item }">
        <TablicaAkcije
          :on-pregled="() => router.push(`/clanovi/${item.id}`)"
          :on-uredi="() => router.push(`/clanovi/${item.id}/uredi`)"
          :on-obrisi="() => { za_brisanje = item; prikazi_dialog = true }"
        />
      </template>
    </v-data-table-server>
  </StranicaKartica>

  <DialogBrisanje
    v-model="prikazi_dialog"
    poruka="Jeste li sigurni da želite obrisati člana?"
    :loading="loading"
    @potvrdi="obrisi"
  />
</template>
