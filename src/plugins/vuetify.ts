import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1a4d7c',
          secondary: '#8b6914',
          accent: '#c9a227',
          success: '#2e7d32',
          warning: '#ef6c00',
          background: '#f0ebe3',
          surface: '#ffffff',
        },
      },
    },
  },
})
