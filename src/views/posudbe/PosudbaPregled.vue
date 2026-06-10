<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PregledOmot from '@/components/PregledOmot.vue'
import { API_URL } from '@/config/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const posudba = reactive({
  id: '',
  knjiga_naslov: '',
  clan_ime_prezime: '',
  datum_posudbe: '',
  datum_vracanja: '',
  aktivna: false,
})

async function dohvati() {
  loading.value = true
  const response = await fetch(`${API_URL}/posudbe/${route.params.id}`)
  Object.assign(posudba, await response.json())
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <PregledOmot
    naslov="Pregled posudbe"
    ikona="mdi-book-arrow-right"
    :loading="loading"
    @uredi="router.push(`/posudbe/${posudba.id}/uredi`)"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-identifier">
        <v-list-item-title>ID</v-list-item-title>
        <v-list-item-subtitle>{{ posudba.id }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-book">
        <v-list-item-title>Knjiga</v-list-item-title>
        <v-list-item-subtitle>{{ posudba.knjiga_naslov }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-account">
        <v-list-item-title>Član</v-list-item-title>
        <v-list-item-subtitle>{{ posudba.clan_ime_prezime }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-calendar-arrow-right">
        <v-list-item-title>Datum posudbe</v-list-item-title>
        <v-list-item-subtitle>{{ posudba.datum_posudbe }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-calendar-check">
        <v-list-item-title>Datum vraćanja</v-list-item-title>
        <v-list-item-subtitle>{{ posudba.datum_vracanja || '—' }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-book-check">
        <v-list-item-title>Aktivna</v-list-item-title>
        <v-list-item-subtitle>{{ posudba.aktivna ? 'Da' : 'Ne' }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <template #akcije>
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/posudbe')"
      >
        Natrag
      </v-btn>
    </template>
  </PregledOmot>
</template>
