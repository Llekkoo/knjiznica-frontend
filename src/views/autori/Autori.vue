<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const router = useRouter()
const loading = ref(false)
const prikazi_dialog_brisanje = ref(false)
const autori = ref<any[]>([])
const autor_za_brisanje = ref<any>(null)
const pretraga = ref('')

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Ime', value: 'ime' },
  { title: 'Prezime', value: 'prezime' },
  { title: 'Država', value: 'drzava' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvatiAutore() {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/autori?q=${encodeURIComponent(pretraga.value)}`)
    autori.value = await response.json()
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}

function idiNaDodavanje() {
  router.push('/autori/dodaj')
}

async function pretrazi() {
  await dohvatiAutore()
}

function pregledaj(item: any) {
  router.push(`/autori/${item.id}`)
}

function uredi(item: any) {
  router.push(`/autori/${item.id}/uredi`)
}

function otvoriBrisanje(item: any) {
  autor_za_brisanje.value = item
  prikazi_dialog_brisanje.value = true
}

function zatvoriBrisanje() {
  autor_za_brisanje.value = null
  prikazi_dialog_brisanje.value = false
}

async function obrisi() {
  if (!autor_za_brisanje.value) return
  loading.value = true
  try {
    await fetch(`${API_URL}/autori/${autor_za_brisanje.value.id}`, { method: 'DELETE' })
    await dohvatiAutore()
  } catch (error) {
    console.log(error)
  }
  loading.value = false
  zatvoriBrisanje()
}

onMounted(dohvatiAutore)
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Autori
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="idiNaDodavanje">Dodaj</v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="pretraga"
        label="Pretraži autore"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mb-4"
        @update:model-value="pretrazi"
      />
      <v-data-table :headers="headers" :items="autori" :loading="loading">
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="pregledaj(item)" />
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="uredi(item)" />
          <v-btn icon="mdi-delete" size="small" variant="text" @click="otvoriBrisanje(item)" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <v-dialog v-model="prikazi_dialog_brisanje" max-width="500">
    <v-card>
      <v-card-title>Potvrda brisanja</v-card-title>
      <v-card-text>Jeste li sigurni da želite obrisati autora?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="zatvoriBrisanje">Odustani</v-btn>
        <v-btn color="red" :loading="loading" @click="obrisi">Obriši</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
