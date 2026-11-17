import {
  Compass, FolderOpen, Home, Map, NotebookPen, Settings, UserRound, Users, type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Exibido na barra inferior do celular. */
  mobile?: boolean
}

export const primaryNav: NavItem[] = [
  { to: '/inicio', label: 'Início', icon: Home, mobile: true },
  { to: '/especies', label: 'Explorar espécies', icon: Compass, mobile: true },
  { to: '/mapa', label: 'Mapa', icon: Map, mobile: true },
  { to: '/diario', label: 'Meu diário', icon: NotebookPen, mobile: true },
  { to: '/comunidade', label: 'Comunidade', icon: Users },
  { to: '/colecoes', label: 'Coleções', icon: FolderOpen },
]

export const accountNav: NavItem[] = [
  { to: '/perfil', label: 'Perfil', icon: UserRound },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export const NEW_OBSERVATION_PATH = '/registro/novo'
