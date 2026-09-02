import { postMap } from './postMap';
import { site } from '../data/site';

export const languages = {
  pt: 'Português',
  es: 'Español',
  en: 'English',
} as const;

export type Locale = keyof typeof languages;

export const defaultLocale: Locale = 'pt';

export const localeNames: Record<Locale, string> = {
  pt: 'pt-BR',
  es: 'es-ES',
  en: 'en-US',
};

export const ogLocales: Record<Locale, string> = {
  pt: 'pt_BR',
  es: 'es_ES',
  en: 'en_US',
};

export const ui = {
  pt: {
    navAbout: "Sobre",
    navBlog: "Blog",
    navProjects: "Projetos",
    navContact: "Contato",
    logoLabel: "Início",
    navLabel: "Navegação principal",
    menuLabel: "Abrir menu",
    menuCloseLabel: "Fechar menu",
    menuName: "Menu",
    skipLink: "Pular para o conteúdo",
    themeToggle: {
      toDark: "Ativar tema escuro",
      toLight: "Ativar tema claro",
      title: "Alternar tema",
    },
    heroEyebrow: "Perfil",
    heroTitle: "Anderson de Lima Carvalho — Engenheiro de Software",
    heroSubtitle:
      "Anderson de Lima Carvalho é engenheiro de software, brasileiro e empreendedor. Cria softwares e soluções com IA que otimizam operações, escalam com eficiência e transformam ideias em realidade. São 14+ anos entre eletrônica e full stack, com Python · TypeScript · C/C++ · ESP32 · SQL/NoSQL · CI/CD · Cloud · IA.",
    figCaption: "ANDERSONLIMACRV",
    portraitAlt: "Retrato em preto e branco de",
    ogImageAlt: "{name} — Desenvolvedor",
    meta: {
      homeTitle: "{name} — Desenvolvedor",
      homeDescription:
        "Anderson de Lima Carvalho é engenheiro de software, brasileiro e empreendedor. Cria automações e soluções com IA que otimizam processos, escalam com eficiência e levam ideias do papel à produção — 14+ anos.",
      blogTitle: "Blog — {name}",
      blogDescription:
        "Mini-blog sobre desenvolvimento, tecnologia e design editorial para a web.",
    },
    sections: {
      about: { title: "Sobre", eyebrow: "Sobre" },
      projects: { title: "Projetos", eyebrow: "Trabalho" },
      blog: { title: "Blog", eyebrow: "Escritos" },
      contact: { title: "Contato", eyebrow: "Fale comigo" },
    },
    aboutQuote:
      "Faço web pensando em quem lê: rápida para carregar, clara para entender e com personalidade para lembrar.",
    aboutBio: [
      "Sou Anderson Carvalho, engenheiro de software com 14+ anos entre hardware e full stack. Transformo problemas complexos em sistemas simples — com Python, TypeScript, C/C++, ESP32, SQL/NoSQL, CI/CD, Cloud e IA.",
      "Levo ideias do papel à produção com confiabilidade: reduzindo atrito, respeitando o tempo de quem usa e medindo resultados — com foco em eficiência, escalabilidade e qualidade.",
    ],
    aboutStackTitle: "Stack",
    aboutContactTitle: "Redes sociais",
    aboutProfileColumn: "Perfil",
    aboutTrajectoryColumn: "Trajetória",
    aboutRoleTitle: "Role",
    aboutMainStackTitle: "Stack principal",
    aboutFocusTitle: "Focus",
    aboutExperienceTitle: "Experience",
    aboutExpertiseTitle: "Expertise",
    aboutSuperpowerTitle: "Superpower",
    aboutLocationTitle: "Localização",
    aboutBadgeWork: "Trabalho",
    aboutBadgeEducation: "Formação",
    blueprint: {
      figName: "IMG01",
      morphTag: "MORPH — EVOLUÇÃO",
      initial: "Inicial",
      final: "Final",
      position: "Posição",
    },
    projects: [
      {
        description: "Este site — portfólio e mini-blog em Astro.",
      },
      {
        description: "Código aberto, experimentos e projetos pessoais.",
      },
      {
        description: "Trajetória profissional e rede de contatos.",
      },
    ],
    blogComingSoon: "Em breve, os primeiros posts.",
    viewAllPosts: "Ver todos os posts",
    relatedPosts: "Leia também",
    contactParagraph:
      "Se você quer conversar sobre projetos, tecnologia ou apenas trocar uma ideia, meu e-mail está sempre aberto.",
    blogLabel: "Blog",
    blogTitle: "Escritos",
    noPosts: "Nenhum post publicado ainda.",
    backToBlog: "Blog",
    readingTime: "{count} min de leitura",
    updatedLabel: "Atualizado",
    share: "Compartilhar",
    shareX: "X · Twitter",
    shareEmail: "Email",
    homeLink: "Início",
    backToTop: "Voltar ao topo",
  },
  es: {
    navAbout: "Sobre mí",
    navBlog: "Blog",
    navProjects: "Proyectos",
    navContact: "Contacto",
    logoLabel: "Inicio",
    navLabel: "Navegación principal",
    menuLabel: "Abrir menú",
    menuCloseLabel: "Cerrar menú",
    menuName: "Menú",
    skipLink: "Saltar al contenido",
    themeToggle: {
      toDark: "Activar tema oscuro",
      toLight: "Activar tema claro",
      title: "Cambiar tema",
    },
    heroEyebrow: "Perfil",
    heroTitle: "Anderson de Lima Carvalho — Ingeniero de Software",
    heroSubtitle:
      "Anderson de Lima Carvalho es ingeniero de software brasileño y emprendedor. Crea software y soluciones con IA que optimizan operaciones, escalan con eficiencia y entregan productos confiables. 14+ años entre electrónica y full stack, con Python · TypeScript · C/C++ · ESP32 · SQL/NoSQL · CI/CD · Cloud · IA.",
    figCaption: "ANDERSONLIMACRV",
    portraitAlt: "Retrato en blanco y negro de",
    ogImageAlt: "{name} — Desarrollador",
    meta: {
      homeTitle: "{name} — Desarrollador",
      homeDescription:
        "Anderson de Lima Carvalho es ingeniero de software y emprendedor. Crea automatizaciones y soluciones con IA que optimizan procesos, escalan con eficiencia y llevan ideas a producción — 14+ años.",
      blogTitle: "Blog — {name}",
      blogDescription:
        "Mini-blog sobre desarrollo, tecnología y diseño editorial para la web.",
    },
    sections: {
      about: { title: "Sobre mí", eyebrow: "Sobre mí" },
      projects: { title: "Proyectos", eyebrow: "Trabajo" },
      blog: { title: "Blog", eyebrow: "Escritos" },
      contact: { title: "Contacto", eyebrow: "Hablemos" },
    },
    aboutQuote:
      "Hago web pensando en quien lee: rápida de cargar, clara de entender y con personalidad para recordar.",
    aboutBio: [
      "Soy Anderson Carvalho, ingeniero de software con 14+ años entre hardware y full stack. Transformo problemas complejos en sistemas simples — con Python, TypeScript, C/C++, ESP32, SQL/NoSQL, CI/CD, Cloud e IA.",
      "Llevo ideas del diseño a producción con confiabilidad: reduzco fricción, respeto el tiempo de quien usa y mido resultados — con foco en eficiencia, escalabilidad y calidad.",
    ],
    aboutStackTitle: "Stack",
    aboutContactTitle: "Redes sociales",
    aboutProfileColumn: "Perfil",
    aboutTrajectoryColumn: "Trayectoria",
    aboutRoleTitle: "Rol",
    aboutMainStackTitle: "Stack principal",
    aboutFocusTitle: "Focus",
    aboutExperienceTitle: "Experiencia",
    aboutExpertiseTitle: "Experto",
    aboutSuperpowerTitle: "Superpoder",
    aboutLocationTitle: "Ubicación",
    aboutBadgeWork: "Trabajo",
    aboutBadgeEducation: "Formación",
    blueprint: {
      figName: "IMG01",
      morphTag: "MORPH — EVOLUCIÓN",
      initial: "Inicial",
      final: "Final",
      position: "Posición",
    },
    projects: [
      {
        description: "Este sitio: portafolio y mini-blog en Astro.",
      },
      {
        description: "Código abierto, experimentos y proyectos personales.",
      },
      {
        description: "Trayectoria profesional y red de contactos.",
      },
    ],
    blogComingSoon: "Pronto llegará el primer post.",
    viewAllPosts: "Ver todos los posts",
    relatedPosts: "También lee",
    contactParagraph:
      "Si quieres hablar de proyectos, tecnología o simplemente intercambiar una idea, mi correo siempre está abierto.",
    blogLabel: "Blog",
    blogTitle: "Escritos",
    noPosts: "Aún no hay posts publicados.",
    backToBlog: "Blog",
    readingTime: "{count} min de lectura",
    updatedLabel: "Actualizado",
    share: "Compartir",
    shareX: "X · Twitter",
    shareEmail: "Correo",
    homeLink: "Inicio",
    backToTop: "Volver arriba",
  },
  en: {
    navAbout: "About",
    navBlog: "Blog",
    navProjects: "Projects",
    navContact: "Contact",
    logoLabel: "Home",
    navLabel: "Primary navigation",
    menuLabel: "Open menu",
    menuCloseLabel: "Close menu",
    menuName: "Menu",
    skipLink: "Skip to content",
    themeToggle: {
      toDark: "Switch to dark theme",
      toLight: "Switch to light theme",
      title: "Toggle theme",
    },
    heroEyebrow: "Profile",
    heroTitle: "Anderson de Lima Carvalho — Software Engineer",
    heroSubtitle:
      "Anderson de Lima Carvalho is a Brazilian software engineer and entrepreneur. He builds software and AI solutions that optimize operations, scale efficiently and deliver reliable products. 14+ years across electronics and full stack, with Python · TypeScript · C/C++ · ESP32 · SQL/NoSQL · CI/CD · Cloud · AI.",
    figCaption: "ANDERSONLIMACRV",
    portraitAlt: "Black and white portrait of",
    ogImageAlt: "{name} — Developer",
    meta: {
      homeTitle: "{name} — Developer",
      homeDescription:
        "Anderson de Lima Carvalho is a Brazilian software engineer and entrepreneur. He builds automation and AI solutions that optimize operations, scale efficiently and take ideas to production — 14+ years.",
      blogTitle: "Blog — {name}",
      blogDescription:
        "Mini-blog about development, technology and editorial design for the web.",
    },
    sections: {
      about: { title: "About", eyebrow: "About" },
      projects: { title: "Projects", eyebrow: "Work" },
      blog: { title: "Blog", eyebrow: "Writings" },
      contact: { title: "Contact", eyebrow: "Get in touch" },
    },
    aboutQuote:
      "I build for the web with readers in mind: fast to load, clear to understand, and with a personality you remember.",
    aboutBio: [
      "I'm Anderson Carvalho, a software engineer with 14+ years across hardware and full stack. I turn complex problems into simple systems — with Python, TypeScript, C/C++, ESP32, SQL/NoSQL, CI/CD, Cloud and AI.",
      "I take ideas from design to production with reliability: reducing friction, respecting users' time and measuring results — focused on efficiency, scalability and quality.",
    ],
    aboutStackTitle: "Stack",
    aboutContactTitle: "Social media",
    aboutProfileColumn: "Profile",
    aboutTrajectoryColumn: "Trajectory",
    aboutRoleTitle: "Role",
    aboutMainStackTitle: "Main stack",
    aboutFocusTitle: "Focus",
    aboutExperienceTitle: "Experience",
    aboutExpertiseTitle: "Expertise",
    aboutSuperpowerTitle: "Superpower",
    aboutLocationTitle: "Location",
    aboutBadgeWork: "Work",
    aboutBadgeEducation: "Education",
    blueprint: {
      figName: "IMG01",
      morphTag: "MORPH — EVOLUTION",
      initial: "Initial",
      final: "Final",
      position: "Position",
    },
    projects: [
      {
        description: "This site — portfolio and mini-blog in Astro.",
      },
      {
        description: "Open source, experiments and personal projects.",
      },
      {
        description: "Professional track record and network.",
      },
    ],
    blogComingSoon: "First posts coming soon.",
    viewAllPosts: "View all posts",
    relatedPosts: "Also read",
    contactParagraph:
      "If you'd like to talk about projects, technology or just exchange ideas, my inbox is always open.",
    blogLabel: "Blog",
    blogTitle: "Writings",
    noPosts: "No posts published yet.",
    backToBlog: "Blog",
    readingTime: "{count} min read",
    updatedLabel: "Updated",
    share: "Share",
    shareX: "X · Twitter",
    shareEmail: "Email",
    homeLink: "Home",
    backToTop: "Back to top",
  },
} as const;

export type Translation = (typeof ui)[Locale];

export function translatePath(path: string, target: Locale): string {
  const clean = path.replace(/^\/(?:pt|es|en)(?=\/|$)/, '');
  const blogMatch = /^\/blog\/([^/]+)\/?$/.exec(clean);
  if (blogMatch) {
    const slug = blogMatch[1];
    for (const entry of Object.values(postMap)) {
      if (Object.values(entry).includes(slug)) {
        const targetSlug = entry[target];
        return target === defaultLocale
          ? `/blog/${targetSlug}`
          : `/${target}/blog/${targetSlug}`;
      }
    }
  }
  if (target === defaultLocale) return clean || '/';
  return `/${target}${clean === '' ? '/' : clean}`;
}

export function translateTitle(template: string, name: string = site.name): string {
  return template.replace(/\{name\}/g, name);
}