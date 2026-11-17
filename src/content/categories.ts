import { Bird, Bug, Flower2, PawPrint, Sprout, Turtle, Droplets, type LucideIcon } from 'lucide-react'
import { photos } from './photos'

export type CategoryKey = 'aves' | 'mamiferos' | 'repteis' | 'anfibios' | 'insetos' | 'plantas' | 'outros'

export interface Category {
  key: CategoryKey
  label: string
  /** Agrupamento taxonômico de referência (nível amplo). */
  taxon: string
  icon: LucideIcon
  photo: string
}

export const categories: Category[] = [
  { key: 'aves', label: 'Aves', taxon: 'Classe Aves', icon: Bird, photo: photos.birds },
  { key: 'mamiferos', label: 'Mamíferos', taxon: 'Classe Mammalia', icon: PawPrint, photo: photos.mammals },
  { key: 'repteis', label: 'Répteis', taxon: 'Classe Reptilia', icon: Turtle, photo: photos.reptiles },
  { key: 'anfibios', label: 'Anfíbios', taxon: 'Classe Amphibia', icon: Droplets, photo: photos.amphibians },
  { key: 'insetos', label: 'Insetos', taxon: 'Classe Insecta', icon: Bug, photo: photos.insects },
  { key: 'plantas', label: 'Plantas', taxon: 'Reino Plantae', icon: Flower2, photo: photos.plants },
  { key: 'outros', label: 'Outros organismos', taxon: 'Fungos, líquens e outros', icon: Sprout, photo: photos.others },
]

export const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c])) as Record<CategoryKey, Category>
