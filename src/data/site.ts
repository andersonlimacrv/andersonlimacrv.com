const phone = '53981004874';

export const site = {
  url: 'https://andersonlimacrv.com',
  name: 'Anderson Carvalho',
  heroEyebrowYear: '2026',
  sections: {
    about: '01',
    projects: '02',
    blog: '03',
    contact: '04',
  },
  socialLinks: {
    github: 'https://github.com/andersonlimacrv',
    linkedin: 'https://www.linkedin.com/in/andersonlimacrv',
    instagram: 'https://instagram.com/andersonlimacrv',
    whatsapp: `https://wa.me/55${phone}`,
    email: 'contato@andersonlimacrv.com',
  },
} as const;

export const siteUrl = site.url;
export const siteName = site.name;
export const authorName = site.name;
export const socialLinks = site.socialLinks;
