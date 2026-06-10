import { ref } from 'vue'

const prikazi = ref(false)
const poruka = ref('')
const boja = ref('success')

export function useSnackbar() {
  function obavijesti(text: string, color = 'success') {
    poruka.value = text
    boja.value = color
    prikazi.value = true
  }

  function uspjeh(text: string) {
    obavijesti(text, 'success')
  }

  function greska(text: string) {
    obavijesti(text, 'error')
  }

  return { prikazi, poruka, boja, obavijesti, uspjeh, greska }
}
