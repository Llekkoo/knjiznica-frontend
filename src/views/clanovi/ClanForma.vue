<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DatePicker from '@/components/DatePicker.vue'
import FormaOmot from '@/components/FormaOmot.vue'
import { API_URL } from '@/config/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const clan = reactive({
  ime: '',
  prezime: '',
  email: '',
  telefon: '',
  datum_uclanjenja: '',
})
const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => (jeUredivanje.value ? 'Uredi člana' : 'Dodaj člana'))

async function dohvati() {
  if (!route.params.id) return
  loading.value = true
  const response = await fetch(`${API_URL}/clanovi/${route.params.id}`)
  Object.assign(clan, await response.json())
  loading.value = false
}

async function spremi() {
  loading.value = true
  const url = jeUredivanje.value ? `${API_URL}/clanovi/${route.params.id}` : `${API_URL}/clanovi`
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clan),
  })
  router.push({
    path: '/clanovi',
    query: { obavijest: jeUredivanje.value ? 'Član je ažuriran.' : 'Član je dodan.' },
  })
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <FormaOmot
    :naslov="naslov"
    ikona="mdi-account-group"
  >
    <v-text-field
      v-model="clan.ime"
      label="Ime"
      prepend-inner-icon="mdi-account"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="clan.prezime"
      label="Prezime"
      prepend-inner-icon="mdi-account-outline"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="clan.email"
      label="E-pošta"
      prepend-inner-icon="mdi-email"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="clan.telefon"
      label="Telefon"
      prepend-inner-icon="mdi-phone"
      variant="outlined"
      density="comfortable"
    />
    <DatePicker
      v-model="clan.datum_uclanjenja"
      label="Datum učlanjenja"
    />

    <template #akcije>
      <v-tooltip text="Vrati se na listu">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            prepend-icon="mdi-arrow-left"
            @click="router.push('/clanovi')"
          >
            Odustani
          </v-btn>
        </template>
      </v-tooltip>
      <v-spacer />
      <v-tooltip text="Spremi u bazu">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            :loading="loading"
            prepend-icon="mdi-content-save"
            @click="spremi"
          >
            Spremi
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </FormaOmot>
</template>
