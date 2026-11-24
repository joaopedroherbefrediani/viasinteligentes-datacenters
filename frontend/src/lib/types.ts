// Espelha backend/src/content/content.data.ts
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

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  interest: string;
  message: string;
}
