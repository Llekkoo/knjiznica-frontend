<template>
  <v-app>
    <v-app-bar
      class="app-bar-gradient"
      elevation="3"
      height="64"
    >
      <v-app-bar-title class="d-flex align-center">
        <v-icon
          icon="mdi-bookshelf"
          class="mr-2"
        />
        Moja knjižnica
      </v-app-bar-title>
      <v-spacer />
      <v-btn
        v-for="link in links"
        :key="link.link"
        :to="link.link"
        :prepend-icon="link.icon"
        :variant="jeAktivan(link.link) ? 'tonal' : 'text'"
        color="white"
        class="mx-1"
      >
        {{ link.text }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container
        class="py-6"
        style="max-width: 1200px;"
      >
        <router-view />
      </v-container>
    </v-main>

    <v-footer
      app
      class="app-footer py-3"
    >
      <v-container
        class="d-flex align-center justify-center text-caption text-medium-emphasis"
        style="max-width: 1200px;"
      >
        <v-icon
          icon="mdi-book-open-variant"
          size="small"
          color="secondary"
          class="mr-1"
        />
        Sustav za upravljanje knjižnicom — Autori · Knjige · Članovi · Posudbe
      </v-container>
    </v-footer>

    <v-snackbar
      v-model="prikazi"
      :color="boja"
      location="bottom right"
      :timeout="3500"
      rounded="lg"
      elevation="6"
    >
      <v-icon
        :icon="boja === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"
        class="mr-2"
      />
      {{ poruka }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'

const route = useRoute()
const { prikazi, poruka, boja } = useSnackbar()

const links = [
  { link: '/', text: 'Početna', icon: 'mdi-home' },
  { link: '/autori', text: 'Autori', icon: 'mdi-account-edit' },
  { link: '/knjige', text: 'Knjige', icon: 'mdi-book' },
  { link: '/clanovi', text: 'Članovi', icon: 'mdi-account-group' },
  { link: '/posudbe', text: 'Posudbe', icon: 'mdi-book-arrow-right' },
]

function jeAktivan(link: string) {
  if (link === '/') return route.path === '/'
  return route.path.startsWith(link)
}
</script>
