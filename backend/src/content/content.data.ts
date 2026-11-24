/**
 * Conteúdo editorial do site.
 *
 * ATENÇÃO: textos de marca vêm do guia "VIAS DATA CENTERS — Identidade e aplicações".
 * Números (estatísticas), serviços e dados de contato são PLACEHOLDERS e devem ser
 * validados/substituídos pela equipe comercial antes da publicação.
 */

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export interface Service {
  id: string;
  icon: 'server' | 'network' | 'zap' | 'shield' | 'cloud' | 'compass';
  title: string;
  description: string;
  highlights: string[];
}

export interface Pillar {
  title: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface SiteContent {
  brand: {
    name: string;
    tagline: string;
    closing: [string, string];
  };
  stats: Stat[];
  pillars: Pillar[];
  group: Pillar[];
  services: Service[];
  infrastructure: { title: string; description: string }[];
  process: ProcessStep[];
  sustainability: Pillar[];
  interests: string[];
  contact: { email: string; phone: string; address: string };
}

export const SITE_CONTENT: SiteContent = {
  brand: {
    name: 'VIAS DATA CENTERS',
    tagline: 'Infraestrutura para novos caminhos',
    closing: ['Uma origem comum.', 'Uma especialidade com nome próprio.'],
  },

  stats: [
    { value: 24, suffix: '/7', label: 'Operação e monitoramento contínuos' },
    { value: 99.98, suffix: '%', decimals: 2, label: 'Disponibilidade projetada' },
    { value: 1, prefix: 'N+', label: 'Redundância em energia e climatização' },
    { value: 100, suffix: '%', label: 'Consumo de energia medido e rastreável' },
  ],

  pillars: [
    {
      title: 'Conexão',
      description: 'Os módulos se aproximam e formam um caminho contínuo — como os dados que trafegam pela sua operação.',
    },
    {
      title: 'Continuidade',
      description: 'A repetição cria um padrão reconhecível. Na infraestrutura, ela significa disponibilidade sem interrupções.',
    },
  ],

  group: [
    {
      title: 'Uma história preservada',
      description: 'A Vias Inteligentes mantém o nome e a identidade pelos quais já é reconhecida.',
    },
    {
      title: 'Um foco explícito',
      description: 'VIAS DATA CENTERS deixa claro, desde o nome, a especialidade do negócio.',
    },
    {
      title: 'Pertencimento visível',
      description: 'O endosso do grupo torna a relação entre as marcas clara desde o primeiro contato.',
    },
    {
      title: 'Expansão organizada',
      description: 'Uma marca com linguagem e ofertas próprias, crescendo a partir de uma origem comum.',
    },
  ],

  services: [
    {
      id: 'colocation',
      icon: 'server',
      title: 'Colocation',
      description: 'Espaço, energia e climatização para os seus equipamentos em um ambiente seguro e monitorado.',
      highlights: ['Racks dedicados e gaiolas', 'Energia redundante', 'Remote hands'],
    },
    {
      id: 'conectividade',
      icon: 'network',
      title: 'Conectividade',
      description: 'Rotas redundantes e múltiplas operadoras para manter a sua operação sempre conectada.',
      highlights: ['Ambiente neutro', 'Cross-connects', 'Baixa latência'],
    },
    {
      id: 'energia',
      icon: 'zap',
      title: 'Energia & Climatização',
      description: 'Infraestrutura elétrica e refrigeração de precisão projetadas para a continuidade.',
      highlights: ['UPS e geradores', 'Contenção de corredores', 'Gestão de PUE'],
    },
    {
      id: 'seguranca',
      icon: 'shield',
      title: 'Segurança física',
      description: 'Controle de acesso em camadas, videomonitoramento e equipe presente 24 horas.',
      highlights: ['Biometria', 'CFTV', 'Auditoria de acessos'],
    },
    {
      id: 'edge',
      icon: 'cloud',
      title: 'Cloud & Edge',
      description: 'Capacidade computacional próxima do seu negócio para aplicações que exigem resposta imediata.',
      highlights: ['Nuvem privada', 'Ambientes híbridos', 'Edge computing'],
    },
    {
      id: 'projetos',
      icon: 'compass',
      title: 'Projetos & Implantação',
      description: 'Do planejamento à entrega: engenharia e gestão de ponta a ponta para novos ambientes.',
      highlights: ['Consultoria', 'Migração', 'Gestão de obras'],
    },
  ],

  infrastructure: [
    {
      title: 'Energia que não para',
      description: 'Caminhos elétricos redundantes, UPS e geração própria para que nenhuma carga fique sem alimentação.',
    },
    {
      title: 'Clima sob controle',
      description: 'Refrigeração de precisão com contenção de corredores quentes e frios e monitoramento contínuo.',
    },
    {
      title: 'Olhos em cada rack',
      description: 'Sensores, telemetria e uma central de operações acompanhando cada indicador em tempo real.',
    },
  ],

  process: [
    {
      step: '01',
      title: 'Planejar',
      description: 'Entendemos a carga, o crescimento esperado e os requisitos de disponibilidade do seu negócio.',
    },
    {
      step: '02',
      title: 'Projetar',
      description: 'Desenhamos a solução: espaço, energia, clima, conectividade e segurança na medida certa.',
    },
    {
      step: '03',
      title: 'Implantar',
      description: 'Executamos a migração e a ativação com planejamento de janelas e riscos controlados.',
    },
    {
      step: '04',
      title: 'Operar',
      description: 'Acompanhamos 24/7, com indicadores transparentes e melhoria contínua.',
    },
  ],

  sustainability: [
    {
      title: 'Eficiência energética',
      description: 'Projeto orientado a reduzir o PUE, com medição contínua do consumo de cada ambiente.',
    },
    {
      title: 'Energia de fontes renováveis',
      description: 'Busca ativa por contratos de energia limpa e certificada para alimentar a operação.',
    },
    {
      title: 'Ciclo de vida responsável',
      description: 'Descarte e reaproveitamento adequados de equipamentos e materiais.',
    },
  ],

  interests: [
    'Colocation',
    'Conectividade',
    'Cloud & Edge',
    'Projetos & Implantação',
    'Parcerias',
    'Outro assunto',
  ],

  contact: {
    email: 'contato@viasdatacenters.com.br',
    phone: '+55 (00) 0000-0000',
    address: 'Endereço a definir',
  },
};
