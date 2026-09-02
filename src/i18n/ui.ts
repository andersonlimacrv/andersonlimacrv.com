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
    jobTitle: "Desenvolvedor de software",
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
    heroSubtitle:
      "Anderson de Lima Carvalho é desenvolvedor de software brasileiro e empreendedor. Cria softwares, automações e soluções com IA para transformar desafios complexos em produtos e sistemas que capacitam empresas a operar de forma mais inteligente, escalar com eficiência e transformar ideias em realidade.",
    figCaption: "ANDERSONLIMACRV",
    portraitAlt: "Retrato em preto e branco de",
    ogImageAlt: "{name} — Desenvolvedor",
    meta: {
      homeTitle: "{name} — Desenvolvedor",
      homeDescription:
        "Desenvolvedor de software. Este é o meu espaço na web: projetos, pensamentos e um mini-blog sobre tecnologia e design.",
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
      "Sou Anderson Carvalho, desenvolvedor com foco em frontend e engenharia web. Trabalho com produtos digitais onde código limpo, design editorial e performance caminham juntos — performance é requisito, não privilégio.",
      "Gosto de transformar problemas reais em interfaces simples: reduzir atrito, respeitar o tempo de quem usa e medir o resultado em vez de decorar.",
    ],
    aboutStackLabel: "Foco",
    aboutStack: [
      "Frontend",
      "Web performance",
      "Design editorial",
      "TypeScript",
      "Astro",
      "Acessibilidade",
    ],
    aboutNowLabel: "Agora",
    aboutNow:
      "disponível para projetos — explorando interfaces mais rápidas e uma web sem excesso.",
    aboutTimelineLabel: "Trajetória",
    aboutStackTitle: "Stack",
    aboutFactsTitle: "Detalhes",
    aboutContactTitle: "Redes sociais",
    aboutDetailsLabel: "Detalhes",
    aboutProfileColumn: "Perfil",
    aboutTrajectoryColumn: "Trajetória",
    aboutNameTitle: "Nome",
    aboutRoleTitle: "Role",
    aboutMainStackTitle: "Stack principal",
    aboutLocationTitle: "Localização",
    aboutBioTitle: "Sobre mim",
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
    contactGridHint: "mova o cursor · clique",
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
    jobTitle: "Desarrollador de software",
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
    heroSubtitle:
      "Anderson de Lima Carvalho es desarrollador de software brasileño y emprendedor. Crea software, automatizaciones y soluciones con IA para transformar desafíos complejos en productos y sistemas que permiten a las empresas operar de forma más inteligente, escalar eficientemente y convertir ideas en realidad.",
    figCaption: "ANDERSONLIMACRV",
    portraitAlt: "Retrato en blanco y negro de",
    ogImageAlt: "{name} — Desarrollador",
    meta: {
      homeTitle: "{name} — Desarrollador",
      homeDescription:
        "Desarrollador de software. Este es mi espacio en la web: proyectos, pensamientos y un mini-blog sobre tecnología y diseño.",
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
      "Soy Anderson Carvalho, desarrollador enfocado en frontend e ingeniería web. Trabajo con productos digitales donde el código limpio, el diseño editorial y el rendimiento caminan juntos — el rendimiento es requisito, no privilegio.",
      "Me gusta convertir problemas reales en interfaces sencillas: reducir la fricción, respetar el tiempo de quien usa y medir el resultado en lugar de decorar.",
    ],
    aboutStackLabel: "Enfoque",
    aboutStack: [
      "Frontend",
      "Rendimiento web",
      "Diseño editorial",
      "TypeScript",
      "Astro",
      "Accesibilidad",
    ],
    aboutNowLabel: "Ahora",
    aboutNow:
      "disponible para proyectos — explorando interfaces más rápidas y una web sin exceso.",
    aboutTimelineLabel: "Trayectoria",
    aboutStackTitle: "Stack",
    aboutFactsTitle: "Detalles",
    aboutContactTitle: "Redes sociales",
    aboutDetailsLabel: "Detalles",
    aboutProfileColumn: "Perfil",
    aboutTrajectoryColumn: "Trayectoria",
    aboutNameTitle: "Nombre",
    aboutRoleTitle: "Rol",
    aboutMainStackTitle: "Stack principal",
    aboutLocationTitle: "Ubicación",
    aboutBioTitle: "Sobre mí",
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
    contactGridHint: "mueve el cursor · haz clic",
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
    jobTitle: "Software developer",
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
    heroSubtitle:
      "Anderson de Lima Carvalho is a Brazilian software developer and entrepreneur. He creates software, automation, and AI-powered solutions to transform complex challenges into products and systems that empower companies to operate smarter, scale efficiently, and turn ideas into reality.",
    figCaption: "ANDERSONLIMACRV",
    portraitAlt: "Black and white portrait of",
    ogImageAlt: "{name} — Developer",
    meta: {
      homeTitle: "{name} — Developer",
      homeDescription:
        "Software developer. This is my corner of the web: projects, thoughts and a mini-blog about technology and design.",
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
      "I'm Anderson Carvalho, a developer focused on frontend and web engineering. I work on digital products where clean code, editorial design and performance go hand in hand — performance is a requirement, not a privilege.",
      "I like turning real problems into simple interfaces: reducing friction, respecting people's time and measuring results instead of decorating.",
    ],
    aboutStackLabel: "Focus",
    aboutStack: [
      "Frontend",
      "Web performance",
      "Editorial design",
      "TypeScript",
      "Astro",
      "Accessibility",
    ],
    aboutNowLabel: "Now",
    aboutNow:
      "available for projects — exploring faster interfaces and a web without excess.",
    aboutTimelineLabel: "Timeline",
    aboutStackTitle: "Stack",
    aboutFactsTitle: "Details",
    aboutContactTitle: "Social media",
    aboutDetailsLabel: "Details",
    aboutProfileColumn: "Profile",
    aboutTrajectoryColumn: "Trajectory",
    aboutNameTitle: "Name",
    aboutRoleTitle: "Role",
    aboutMainStackTitle: "Main stack",
    aboutLocationTitle: "Location",
    aboutBioTitle: "About me",
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
    contactGridHint: "move your cursor · click",
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