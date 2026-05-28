import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Pocetna = () => import('@/views/pages/Pocetna.vue')
const Autori = () => import('@/views/autori/Autori.vue')
const AutorForma = () => import('@/views/autori/AutorForma.vue')
const AutorPregled = () => import('@/views/autori/AutorPregled.vue')
const Knjige = () => import('@/views/knjige/Knjige.vue')
const KnjigaForma = () => import('@/views/knjige/KnjigaForma.vue')
const KnjigaPregled = () => import('@/views/knjige/KnjigaPregled.vue')
const Clanovi = () => import('@/views/clanovi/Clanovi.vue')
const ClanForma = () => import('@/views/clanovi/ClanForma.vue')
const ClanPregled = () => import('@/views/clanovi/ClanPregled.vue')
const Posudbe = () => import('@/views/posudbe/Posudbe.vue')
const PosudbaForma = () => import('@/views/posudbe/PosudbaForma.vue')
const PosudbaPregled = () => import('@/views/posudbe/PosudbaPregled.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Pocetna', component: Pocetna },
  { path: '/autori', name: 'Autori', component: Autori },
  { path: '/autori/dodaj', name: 'AutorDodaj', component: AutorForma },
  { path: '/autori/:id', name: 'AutorPregled', component: AutorPregled },
  { path: '/autori/:id/uredi', name: 'AutorUredi', component: AutorForma },
  { path: '/knjige', name: 'Knjige', component: Knjige },
  { path: '/knjige/dodaj', name: 'KnjigaDodaj', component: KnjigaForma },
  { path: '/knjige/:id', name: 'KnjigaPregled', component: KnjigaPregled },
  { path: '/knjige/:id/uredi', name: 'KnjigaUredi', component: KnjigaForma },
  { path: '/clanovi', name: 'Clanovi', component: Clanovi },
  { path: '/clanovi/dodaj', name: 'ClanDodaj', component: ClanForma },
  { path: '/clanovi/:id', name: 'ClanPregled', component: ClanPregled },
  { path: '/clanovi/:id/uredi', name: 'ClanUredi', component: ClanForma },
  { path: '/posudbe', name: 'Posudbe', component: Posudbe },
  { path: '/posudbe/dodaj', name: 'PosudbaDodaj', component: PosudbaForma },
  { path: '/posudbe/:id', name: 'PosudbaPregled', component: PosudbaPregled },
  { path: '/posudbe/:id/uredi', name: 'PosudbaUredi', component: PosudbaForma },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
