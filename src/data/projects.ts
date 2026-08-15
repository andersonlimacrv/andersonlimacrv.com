import { ui, type Locale } from '../i18n/ui';
import { socialLinks } from '../lib/site';

export interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

// Fonte única dos projetos da home (ver plan-redesign.md — Fase 02:
// conteúdo separado da apresentação). Descrições vêm do dicionário i18n.
export const projects: Record<Locale, Project[]> = {
  pt: [
    {
      title: 'andersonlimacrv.com',
      description: ui.pt.projects[0].description,
      url: 'https://andersonlimacrv.com',
      tags: ['Astro', 'Tailwind'],
    },
    {
      title: 'GitHub',
      description: ui.pt.projects[1].description,
      url: socialLinks.github,
      tags: ['Open Source'],
    },
    {
      title: 'LinkedIn',
      description: ui.pt.projects[2].description,
      url: socialLinks.linkedin,
      tags: ['Perfil'],
    },
  ],
  es: [
    {
      title: 'andersonlimacrv.com',
      description: ui.es.projects[0].description,
      url: 'https://andersonlimacrv.com',
      tags: ['Astro', 'Tailwind'],
    },
    {
      title: 'GitHub',
      description: ui.es.projects[1].description,
      url: socialLinks.github,
      tags: ['Open Source'],
    },
    {
      title: 'LinkedIn',
      description: ui.es.projects[2].description,
      url: socialLinks.linkedin,
      tags: ['Perfil'],
    },
  ],
  en: [
    {
      title: 'andersonlimacrv.com',
      description: ui.en.projects[0].description,
      url: 'https://andersonlimacrv.com',
      tags: ['Astro', 'Tailwind'],
    },
    {
      title: 'GitHub',
      description: ui.en.projects[1].description,
      url: socialLinks.github,
      tags: ['Open Source'],
    },
    {
      title: 'LinkedIn',
      description: ui.en.projects[2].description,
      url: socialLinks.linkedin,
      tags: ['Perfil'],
    },
  ],
};

export function getProjects(locale: Locale): Project[] {
  return projects[locale];
}