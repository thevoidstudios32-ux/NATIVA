import {
  Compass, FolderOpen, Home, Leaf, Map, NotebookPen, PenLine, Settings, UserRound, Users,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import { StagePlaceholder } from './StagePlaceholder'

export const Dashboard = () => (
  <StagePlaceholder
    eyebrow="Meu NATIVA" title={<>Seu caderno de campo, <em className="text-sage">em resumo.</em></>}
    description="Estatísticas calculadas a partir dos seus registros reais, últimas observações e atalhos."
    stage={2} icon={Home}
    plan={['Total de observações', 'Espécies diferentes registradas', 'Total de fotografias', 'Últimas observações e atividade', 'Prévia do mapa pessoal', 'Estado inicial para contas vazias']}
  />
)

export const Species = () => (
  <StagePlaceholder
    eyebrow="Catálogo" title={<>Explorar <em className="text-sage">espécies.</em></>}
    description="Fichas científicas com nome popular e científico, família, habitat, distribuição e referências."
    stage={3} icon={Compass}
    plan={['Pesquisa por nome popular e científico', 'Filtros por categoria', 'Fichas com fontes de referência', 'Informação científica separada das observações']}
  />
)

export const SpeciesDetail = () => {
  const { slug } = useParams()
  return (
    <StagePlaceholder
      eyebrow="Ficha de espécie" title={<em className="text-sage">{slug}</em>}
      description="Ficha individual de espécie com dados científicos referenciados e observações públicas relacionadas."
      stage={3} icon={Leaf}
      plan={['Descrição, habitat, alimentação', 'Distribuição geográfica', 'Fotografias', 'Referências científicas']}
    />
  )
}

export const ObservationMap = () => (
  <StagePlaceholder
    eyebrow="Mapa" title={<>Mapa de <em className="text-sage">observações.</em></>}
    description="Meu mapa (registros pessoais) e mapa da comunidade (somente registros públicos, com coordenadas aproximadas)."
    stage={4} icon={Map}
    plan={['Marcadores interativos', 'Filtros por categoria e período', 'Pesquisa por região', 'Mapa público na Etapa 5']}
  />
)

export const NewObservation = () => (
  <StagePlaceholder
    eyebrow="Registro de campo" title={<>Nova <em className="text-sage">observação.</em></>}
    description="Formulário com campos que se adaptam à categoria, fotografias, localização opcional e rascunhos."
    stage={3} icon={PenLine}
    plan={['Campos específicos por categoria', 'Upload de múltiplas fotografias', 'Localização por GPS ou seleção no mapa', 'Rascunhos e identificação pendente']}
  />
)

export const Journal = () => (
  <StagePlaceholder
    eyebrow="Meu diário de campo" title={<>Todas as suas <em className="text-sage">observações.</em></>}
    description="Histórico cronológico com pesquisa, filtros, ordenação, edição e exclusão."
    stage={4} icon={NotebookPen}
    plan={['Visualização em cards e detalhada', 'Pesquisa, filtros e ordenação', 'Editar e excluir registros', 'Acesso às fotografias e ao mapa']}
  />
)

export const Community = () => (
  <StagePlaceholder
    eyebrow="Comunidade" title={<>Descobertas <em className="text-sage">compartilhadas.</em></>}
    description="Observações públicas recentes, com região aproximada e autor quando o perfil for público."
    stage={5} icon={Users}
    plan={['Observações públicas recentes', 'Sugestões de identificação', 'Denúncia de registros', 'Registros privados nunca aparecem aqui']}
  />
)

export const Collections = () => (
  <StagePlaceholder
    eyebrow="Minhas coleções" title={<>Organize suas <em className="text-sage">descobertas.</em></>}
    description="Agrupe observações por trilha, projeto, estação ou tema — com nome, descrição e visibilidade."
    stage={5} icon={FolderOpen}
    plan={['Criar, editar e excluir coleções', 'Adicionar e remover observações', 'Visibilidade privada ou pública']}
  />
)

export const Profile = () => (
  <StagePlaceholder
    eyebrow="Perfil" title={<>Seu <em className="text-sage">perfil.</em></>}
    description="Nome, foto, biografia e escolha de perfil público ou privado."
    stage={2} icon={UserRound}
    plan={['Foto de perfil (Supabase Storage)', 'Biografia e nome de usuário', 'Perfil público opcional']}
  />
)

export const AccountSettings = () => (
  <StagePlaceholder
    eyebrow="Configurações" title={<>Configurações <em className="text-sage">da conta.</em></>}
    description="Dados pessoais, preferências de privacidade, senha e sessão."
    stage={2} icon={Settings}
    plan={['Editar informações pessoais', 'Preferências de privacidade', 'Alterar senha', 'Encerrar sessão']}
  />
)
