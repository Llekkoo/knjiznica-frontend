<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PregledOmot from '@/components/PregledOmot.vue'
import { API_URL } from '@/config/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const clan = reactive({
  id: '',
  ime: '',
  prezime: '',
  email: '',
  telefon: '',
  datum_uclanjenja: '',
})

async function dohvati() {
  loading.value = true
  const response = await fetch(`${API_URL}/clanovi/${route.params.id}`)
  Object.assign(clan, await response.json())
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <PregledOmot
    naslov="Pregled člana"
    ikona="mdi-account-group"
    :loading="loading"
    @uredi="router.push(`/clanovi/${clan.id}/uredi`)"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-identifier">
        <v-list-item-title>ID</v-list-item-title>
        <v-list-item-subtitle>{{ clan.id }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-account">
        <v-list-item-title>Ime</v-list-item-title>
        <v-list-item-subtitle>{{ clan.ime }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-account-outline">
        <v-list-item-title>Prezime</v-list-item-title>
        <v-list-item-subtitle>{{ clan.prezime }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-email">
        <v-list-item-title>E-pošta</v-list-item-title>
        <v-list-item-subtitle>{{ clan.email || '—' }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-phone">
        <v-list-item-title>Telefon</v-list-item-title>
        <v-list-item-subtitle>{{ clan.telefon || '—' }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-calendar">
        <v-list-item-title>Datum učlanjenja</v-list-item-title>
        <v-list-item-subtitle>{{ clan.datum_uclanjenja || '—' }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <template #akcije>
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/clanovi')"
      >
        Natrag
      </v-btn>
    </template>
  </PregledOmot>
</template>
