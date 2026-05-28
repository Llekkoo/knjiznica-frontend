<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:5005'
const router = useRouter()
const loading = ref(false)
const prikazi_dialog_brisanje = ref(false)
const clanovi = ref<any[]>([])
const clan_za_brisanje = ref<any>(null)
const pretraga = ref('')

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Ime', value: 'ime' },
  { title: 'Prezime', value: 'prezime' },
  { title: 'E-pošta', value: 'email' },
  { title: 'Telefon', value: 'telefon' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvatiClanove() {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/clanovi?q=${encodeURIComponent(pretraga.value)}`)
    clanovi.value = await response.json()
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}

async function obrisi() {
  if (!clan_za_brisanje.value) return
  loading.value = true
  await fetch(`${API_URL}/clanovi/${clan_za_brisanje.value.id}`, { method: 'DELETE' })
  await dohvatiClanove()
  loading.value = false
  prikazi_dialog_brisanje.value = false
}

onMounted(dohvatiClanove)
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Članovi
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/clanovi/dodaj')">Dodaj</v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="pretraga"
        label="Pretraži članove"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mb-4"
        @update:model-value="dohvatiClanove"
      />
      <v-data-table :headers="headers" :items="clanovi" :loading="loading">
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="router.push(`/clanovi/${item.id}`)" />
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="router.push(`/clanovi/${item.id}/uredi`)" />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            @click="clan_za_brisanje = item; prikazi_dialog_brisanje = true"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <v-dialog v-model="prikazi_dialog_brisanje" max-width="500">
    <v-card>
      <v-card-title>Potvrda brisanja</v-card-title>
      <v-card-text>Jeste li sigurni da želite obrisati člana?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="prikazi_dialog_brisanje = false">Odustani</v-btn>
        <v-btn color="red" :loading="loading" @click="obrisi">Obriši</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
