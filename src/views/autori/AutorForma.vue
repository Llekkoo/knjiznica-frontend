<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormaOmot from '@/components/FormaOmot.vue'
import { API_URL } from '@/config/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const autor = reactive({ ime: '', prezime: '', drzava: '' })
const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => (jeUredivanje.value ? 'Uredi autora' : 'Dodaj autora'))

async function dohvati() {
  if (!route.params.id) return
  loading.value = true
  const response = await fetch(`${API_URL}/autori/${route.params.id}`)
  Object.assign(autor, await response.json())
  loading.value = false
}

async function spremi() {
  loading.value = true
  const url = jeUredivanje.value ? `${API_URL}/autori/${route.params.id}` : `${API_URL}/autori`
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(autor),
  })
  router.push({
    path: '/autori',
    query: { obavijest: jeUredivanje.value ? 'Autor je ažuriran.' : 'Autor je dodan.' },
  })
  loading.value = false
}

onMounted(dohvati)
</script>

<template>
  <FormaOmot
    :naslov="naslov"
    ikona="mdi-account-edit"
  >
    <v-text-field
      v-model="autor.ime"
      label="Ime"
      prepend-inner-icon="mdi-account"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="autor.prezime"
      label="Prezime"
      prepend-inner-icon="mdi-account-outline"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="autor.drzava"
      label="Država"
      prepend-inner-icon="mdi-earth"
      variant="outlined"
      density="comfortable"
    />

    <template #akcije>
      <v-tooltip text="Vrati se na listu">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            prepend-icon="mdi-arrow-left"
            @click="router.push('/autori')"
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
