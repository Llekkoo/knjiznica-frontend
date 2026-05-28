<script setup lang="ts">
import { onMounted, ref } from 'vue'

const API_URL = 'http://localhost:5005'
const loading = ref(false)
const greska = ref('')

const statistika = ref({
  broj_autora: 0,
  broj_knjiga: 0,
  broj_clanova: 0,
  aktivne_posudbe: 0,
  prosjecna_godina: 0,
})

async function dohvatiStatistiku() {
  loading.value = true
  greska.value = ''
  try {
    const response = await fetch(`${API_URL}/dashboard`)
    if (!response.ok) {
      throw new Error('Backend ne odgovara')
    }
    statistika.value = await response.json()
  } catch {
    greska.value = 'Ne mogu se spojiti na backend. Pokreni MySQL (XAMPP) pa u terminalu: python app.py'
  }
  loading.value = false
}

onMounted(dohvatiStatistiku)
</script>

<template>
  <div>
    <h1 class="text-h4 mb-2">
      Dobrodošli u Knjižnicu
    </h1>
    <p class="text-body-1 text-medium-emphasis mb-6">
      Ovo je početna stranica (dashboard). Brojevi dolaze iz MySQL baze preko backend API-ja.
    </p>

    <v-alert
      v-if="greska"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ greska }}
    </v-alert>

    <v-card
      variant="outlined"
      class="mb-6"
    >
      <v-card-title>Kako koristiti aplikaciju</v-card-title>
      <v-card-text>
        <ol class="pl-4">
          <li>Gore u izborniku odaberi <strong>Autori</strong>, <strong>Knjige</strong>, <strong>Članovi</strong> ili <strong>Posudbe</strong>.</li>
          <li>Klikni <strong>Dodaj</strong> za novi zapis ili ikone oka / olovke / koša za pregled, uređivanje i brisanje.</li>
          <li>Svi podaci spremaju se u bazu – ako refreshaš stranicu, ostaju spremljeni.</li>
        </ol>
      </v-card-text>
    </v-card>

    <h2 class="text-h6 mb-4">
      Pregled baze (statistika)
    </h2>

    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          color="primary"
          variant="tonal"
        >
          <v-card-title>Autori (pisaci)</v-card-title>
          <v-card-text class="text-h3">
            {{ statistika.broj_autora }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          color="secondary"
          variant="tonal"
        >
          <v-card-title>Knjige u fond-u</v-card-title>
          <v-card-text class="text-h3">
            {{ statistika.broj_knjiga }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          color="success"
          variant="tonal"
        >
          <v-card-title>Članovi knjižnice</v-card-title>
          <v-card-text class="text-h3">
            {{ statistika.broj_clanova }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="6"
      >
        <v-card
          color="warning"
          variant="tonal"
        >
          <v-card-title>Aktivne posudbe (knjige kod članova)</v-card-title>
          <v-card-text class="text-h3">
            {{ statistika.aktivne_posudbe }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="6"
      >
        <v-card variant="outlined">
          <v-card-title>Prosječna godina izdanja knjiga</v-card-title>
          <v-card-text class="text-h3">
            {{ statistika.prosjecna_godina }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-progress-linear
      v-if="loading"
      indeterminate
      class="mt-6"
    />
  </div>
</template>
