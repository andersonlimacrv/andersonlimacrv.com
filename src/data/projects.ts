import { ui, type Locale } from '../i18n/ui';
import { site, socialLinks } from './site';

export interface Project {
  title: string;
  description: string;
  url: string;
  tags: readonly string[];
}

// Fonte única dos projetos (fatos: título, URL, tags) — compartilhada entre
// idiomas. Descrições vêm do dicionário i18n via getProjects(locale).
const projectFacts = [
  { title: 'andersonlimacrv.com', url: site.url, tags: ['Astro', 'Tailwind'] },
  { title: 'GitHub', url: socialLinks.github, tags: ['Open Source'] },
  { title: 'LinkedIn', url: socialLinks.linkedin, tags: ['Perfil'] },
] as const;

export function getProjects(locale: Locale): Project[] {
  return projectFacts.map((fact, i) => ({
    ...fact,
    description: ui[locale].projects[i].description,
  }));
}
