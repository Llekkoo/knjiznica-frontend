<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const router = useRouter()
const loading = ref(false)
const prikazi_dialog_brisanje = ref(false)
const posudbe = ref<any[]>([])
const posudba_za_brisanje = ref<any>(null)
const page = ref(1)
const per_page = ref(10)
const total = ref(0)
const pretraga = ref('')

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Knjiga', value: 'knjiga_naslov' },
  { title: 'Član', value: 'clan_ime_prezime' },
  { title: 'Posudba', value: 'datum_posudbe' },
  { title: 'Vraćanje', value: 'datum_vracanja' },
  { title: 'Aktivna', value: 'aktivna' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvatiPosudbe() {
  loading.value = true
  try {
    const response = await fetch(
      `${API_URL}/posudbe?page=${page.value}&per_page=${per_page.value}&q=${encodeURIComponent(pretraga.value)}`,
    )
    const data = await response.json()
    posudbe.value = data.items
    page.value = data.page
    per_page.value = data.per_page
    total.value = data.total
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}

async function pretrazi() {
  page.value = 1
  await dohvatiPosudbe()
}

async function promijeniOpcije(opcije: any) {
  page.value = opcije.page
  per_page.value = opcije.itemsPerPage
  await dohvatiPosudbe()
}

async function obrisi() {
  if (!posudba_za_brisanje.value) return
  loading.value = true
  await fetch(`${API_URL}/posudbe/${posudba_za_brisanje.value.id}`, { method: 'DELETE' })
  await dohvatiPosudbe()
  loading.value = false
  prikazi_dialog_brisanje.value = false
}

onMounted(dohvatiPosudbe)
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Posudbe
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/posudbe/dodaj')">Dodaj</v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="pretraga"
        label="Pretraži posudbe"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mb-4"
        @update:model-value="pretrazi"
      />
      <v-data-table-server
        v-model:items-per-page="per_page"
        v-model:page="page"
        :headers="headers"
        :items="posudbe"
        :items-length="total"
        :loading="loading"
        @update:options="promijeniOpcije"
      >
        <template #item.aktivna="{ item }">
          <v-chip :color="item.aktivna ? 'success' : 'grey'" size="small">
            {{ item.aktivna ? 'Da' : 'Ne' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="router.push(`/posudbe/${item.id}`)" />
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="router.push(`/posudbe/${item.id}/uredi`)" />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            @click="posudba_za_brisanje = item; prikazi_dialog_brisanje = true"
          />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
  <v-dialog v-model="prikazi_dialog_brisanje" max-width="500">
    <v-card>
      <v-card-title>Potvrda brisanja</v-card-title>
      <v-card-text>Jeste li sigurni da želite obrisati posudbu?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="prikazi_dialog_brisanje = false">Odustani</v-btn>
        <v-btn color="red" :loading="loading" @click="obrisi">Obriši</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
