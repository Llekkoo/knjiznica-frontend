<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '@/config/api'

const router = useRouter()
const loading = ref(false)
const greska = ref('')

const statistika = ref({
  broj_autora: 0,
  broj_knjiga: 0,
  broj_clanova: 0,
  aktivne_posudbe: 0,
})

const kartice = [
  { key: 'broj_autora', naslov: 'Autori', ikona: 'mdi-account-edit', boja: 'primary', ruta: '/autori' },
  { key: 'broj_knjiga', naslov: 'Knjige', ikona: 'mdi-book-open-variant', boja: 'secondary', ruta: '/knjige' },
  { key: 'broj_clanova', naslov: 'Članovi', ikona: 'mdi-account-group', boja: 'success', ruta: '/clanovi' },
  { key: 'aktivne_posudbe', naslov: 'Aktivne posudbe', ikona: 'mdi-book-arrow-right', boja: 'warning', ruta: '/posudbe' },
]

async function dohvatiStatistiku() {
  loading.value = true
  greska.value = ''
  try {
    const response = await fetch(`${API_URL}/dashboard`)
    if (!response.ok) {
      throw new Error('Backend ne odgovara')
    }
    const data = await response.json()
    statistika.value = {
      broj_autora: data.broj_autora,
      broj_knjiga: data.broj_knjiga,
      broj_clanova: data.broj_clanova,
      aktivne_posudbe: data.aktivne_posudbe,
    }
  } catch {
    greska.value = 'Ne mogu se spojiti na backend. Pokreni MySQL (XAMPP) pa python app.py'
  }
  loading.value = false
}

onMounted(dohvatiStatistiku)
</script>

<template>
  <div>
    <div class="hero-banner pa-6 pa-md-8 mb-6">
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-bookshelf"
          size="48"
          color="accent"
          class="mr-3"
        />
        <div>
          <h1 class="text-h4 font-weight-bold">
            Dobrodošli u Knjižnicu
          </h1>
          <p class="text-body-2 text-white text-opacity-80 mb-0 mt-1">
            Upravljanje autorima, knjigama, članovima i posudbama
          </p>
        </div>
      </div>
    </div>

    <v-alert
      v-if="greska"
      type="error"
      variant="tonal"
      class="mb-4"
      rounded="lg"
    >
      {{ greska }}
    </v-alert>

    <div class="text-subtitle-1 font-weight-bold text-primary mb-3 d-flex align-center">
      <v-icon
        icon="mdi-chart-box"
        class="mr-2"
        color="secondary"
      />
      Pregled baze podataka
    </div>

    <v-row class="mb-6">
      <v-col
        v-for="kartica in kartice"
        :key="kartica.key"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          :color="kartica.boja"
          variant="tonal"
          class="stat-kartica"
          elevation="1"
          @click="router.push(kartica.ruta)"
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <v-avatar
                :color="kartica.boja"
                size="44"
              >
                <v-icon
                  :icon="kartica.ikona"
                  color="white"
                />
              </v-avatar>
              <v-icon
                icon="mdi-chevron-right"
                :color="kartica.boja"
              />
            </div>
            <div class="text-h4 font-weight-bold">
              {{ statistika[kartica.key as keyof typeof statistika] }}
            </div>
            <div class="text-subtitle-2">
              {{ kartica.naslov }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card
      class="kartica"
      elevation="2"
    >
      <v-card-title class="d-flex align-center bg-grey-lighten-4 pa-4">
        <v-icon
          icon="mdi-information"
          color="primary"
          class="mr-2"
        />
        Kako koristiti aplikaciju
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-list-item
              prepend-icon="mdi-menu"
              rounded="lg"
              class="mb-2"
            >
              <v-list-item-title>Odaberi modul</v-list-item-title>
              <v-list-item-subtitle>Autori, Knjige, Članovi, Posudbe</v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-list-item
              prepend-icon="mdi-plus-circle"
              rounded="lg"
              class="mb-2"
            >
              <v-list-item-title>CRUD operacije</v-list-item-title>
              <v-list-item-subtitle>Dodaj, pregledaj, uredi i obriši</v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-list-item
              prepend-icon="mdi-magnify"
              rounded="lg"
              class="mb-2"
            >
              <v-list-item-title>Pretraga i filtri</v-list-item-title>
              <v-list-item-subtitle>Pretraga i paginacija na backendu</v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mt-4"
      rounded
    />
  </div>
</template>
