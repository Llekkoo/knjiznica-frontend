<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>Moja knjižnica</v-app-bar-title>

      <v-spacer />

      <v-btn
        v-for="link in links"
        :key="link.link"
        :to="link.link"
        variant="text"
      >
        {{ link.text }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const links = [
  { link: '/', text: 'Početna' },
  { link: '/autori', text: 'Autori' },
  { link: '/knjige', text: 'Knjige' },
  { link: '/clanovi', text: 'Članovi' },
  { link: '/posudbe', text: 'Posudbe' },
]
</script>
