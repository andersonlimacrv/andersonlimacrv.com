export interface ProfileHero {
  name: string;
  title: string;
  intro: string;
  bio: string;
  location: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
  };
}

export interface AboutItem {
  label: string;
  value: string;
}

export interface TechGroup {
  label: string;
  items: string[];
}

export interface TimelineEntry {
  role: string;
  company: string;
  period: string;
}

export interface ExperienceDetail {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights:
    | string[]
    | {
        frontend?: string[];
        backend?: string[];
        embeddedAndIot?: string[];
      };
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
}

export interface Profile {
  hero: ProfileHero;
  about: AboutItem[];
  techStack: TechGroup[];
  careerJourney: TimelineEntry[];
  experienceDetails: ExperienceDetail[];
  education: EducationEntry[];
}

// Fonte única do perfil (fatos em pt) — extraído de add-data.json.
// Campos OUTDATED_* foram descartados. careerJourney ordenado do mais
// recente ao mais antigo (período inicial desc; "presente" como agora).
export const profile: Profile = {
  hero: {
    name: 'Anderson Carvalho',
    title: 'Full Stack Developer | Python | TypeScript | IoT | Eletrônica',
    intro:
      'Full Stack Software Engineer com mais de 6 anos de experiência, transformando dispositivos, dados e processos em plataformas escaláveis.',
    bio: 'Minha carreira começou no hardware. Hoje atuo projetando e desenvolvendo soluções end-to-end, integrando firmware, backend, frontend, cloud e infraestrutura, atuando em todo o ciclo de desenvolvimento, da arquitetura à operação em produção. Acredito que o papel da engenharia de software é transformar problemas complexos em soluções simples, escaláveis e sustentáveis.',
    location: 'Pelotas, Rio Grande do Sul, Brasil',
    contact: {
      phone: '53981004874',
      email: 'andersonlimacrv@gmail.com',
      linkedin: 'https://www.linkedin.com/in/andersonlimacrv',
    },
  },
  about: [
    {
      label: 'Role',
      value:
        'Full Stack Developer. Atuo do firmware ao frontend, passando por backend, cloud e infraestrutura.',
    },
    {
      label: 'Focus',
      value:
        'Soluções end-to-end integrando IoT, sistemas distribuídos e aplicações orientadas por IA.',
    },
    {
      label: 'Stack',
      value:
        'Python, FastAPI, Django, Node.js, React, Next.js, TypeScript, Tailwind CSS, C++, ESP32, MQTT, PostgreSQL, Docker, AWS.',
    },
    {
      label: 'Experience',
      value:
        '6+ anos de experiência, com origem em hardware/eletrônica antes de migrar para desenvolvimento full stack.',
    },
    {
      label: 'Superpower',
      value:
        'Transformar problemas complexos em soluções simples, escaláveis e sustentáveis, do design de arquitetura até a operação em produção.',
    },
    { label: 'Location', value: 'Pelotas, Rio Grande do Sul, Brasil.' },
  ],
  techStack: [
    {
      label: 'Backend',
      items: [
        'Python',
        'FastAPI',
        'Django',
        'Node.js',
        'REST APIs',
        'API Design',
        'Async Python',
        'AsyncIO',
        'WebSockets',
        'SQL',
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Redis',
        'Prisma',
        'Pandas',
      ],
    },
    {
      label: 'Frontend',
      items: [
        'React',
        'Next.js',
        'Vite',
        'JavaScript',
        'TypeScript',
        'Tailwind CSS',
        'HTML5',
        'CSS3',
        'Bootstrap',
        'jQuery',
        'Framer Motion',
        'Responsive Design',
        'Mobile First',
      ],
    },
    {
      label: 'Embedded & IoT',
      items: [
        'C++',
        'ESP32',
        'PlatformIO',
        'FreeRTOS',
        'MQTT',
        'IoT',
        'Event-Driven Architecture',
      ],
    },
    {
      label: 'Cloud & DevOps',
      items: ['Git', 'GitHub Actions', 'CI/CD', 'Docker', 'Linux', 'AWS', 'Heroku', 'VPS'],
    },
    {
      label: 'Software Engineering',
      items: [
        'Clean Architecture',
        'Software Architecture',
        'SOLID',
        'OOP',
        'Clean Code',
        'Distributed Systems',
        'Microservices',
        'Observability',
        'Performance Optimization',
        'Test Automation',
      ],
    },
    {
      label: 'Artificial Intelligence',
      items: [
        'LLMs',
        'Context Engineering',
        'Prompt Engineering',
        'Spec-Driven Development',
        'Harness',
        'MCP',
        'RAG',
      ],
    },
  ],
  careerJourney: [
    {
      role: 'Pós-graduação, Inteligência Artificial e Machine Learning',
      company: 'Universidade Católica de Pelotas',
      period: 'maio de 2026 — maio de 2027',
    },
    {
      role: 'Software Developer',
      company: 'CESS - Computational Energy Saving Solution',
      period: 'dezembro de 2022 — presente',
    },
    {
      role: 'CST, Análise de Sistemas de Computação',
      company: 'Universidade Católica de Pelotas',
      period: 'dezembro de 2022 — dezembro de 2024',
    },
    {
      role: 'Analista de Suporte Técnico',
      company: 'Companytec Automação e Controle Ltda',
      period: 'outubro de 2019 — março de 2022',
    },
    {
      role: 'Técnico em eletrônica',
      company: 'Companytec Automação e Controle Ltda',
      period: 'outubro de 2014 — outubro de 2019',
    },
    {
      role: 'Técnico em eletrônica',
      company: 'Argus Agro Industrial Ltda.',
      period: 'março de 2012 — abril de 2014',
    },
    {
      role: 'Curso Técnico Integrado, Eletrônica',
      company: 'IFSUL - Instituto Federal Sul-rio-grandense',
      period: 'julho de 2007 — novembro de 2011',
    },
  ],
  experienceDetails: [
    {
      company: 'CESS - Computational Energy Saving Solution',
      role: 'Software Developer',
      period: 'dezembro de 2022 — presente (3 anos 9 meses)',
      location: 'Rio Grande do Sul, Brasil',
      highlights: {
        frontend: [
          'Arquitetura utilizando React, Next.js, Vite e Tailwind (SSR/SSG/RSC), otimizações de bundle, code-splitting lazy-loading e TypeScript avançado.',
          'Data-layer com React Query, Redux, Zustand e Context API, e custom hooks.',
          'Dashboards em tempo real via WebSockets/SignalR, incluindo telemetria, gráficos e comandos remotos.',
          'Módulos de relatórios (PDF, Excel, CSV) integrados a pipelines de dados.',
          'Design systems, Storybook, tokens de design e testes visuais para padronização entre squads.',
          'Autenticação/Autorização (JWT, OAuth2/OIDC), proteção XSS/CSRF e hardening de headers.',
          'Modernização de aplicações legadas (HTML/CSS/JS/Bootstrap), foco em performance e acessibilidade.',
        ],
        backend: [
          'APIs assíncronas de alta performance em Python (FastAPI/Django), aplicando Clean Architecture.',
          'Governança de APIs: OpenAPI, Pydantic, validação forte, ORMs assíncronos, dependency injection e background tasks.',
          'Broker MQTT contêinerizado com autenticação, ACLs, mTLS/TLS e gestão de certificados.',
          'Pipelines assíncronos de telemetria (~100 msgs/min) com particionamento, batching, idempotência, backpressure e autoscaling.',
          'PostgreSQL/time-series: modelagem, indexação, partitioning temporal, tuning, migrations (Alembic) e async pooling.',
          'Docker, automação de builds, secrets management, CI/CD (GitHub Actions), logging estruturado, tracing e observabilidade.',
        ],
        embeddedAndIot: [
          'Firmwares em C++ e FreeRTOS multitarefa, gerenciamento de memória, drivers e otimização de consumo/real-time.',
          'Comunicação MQTT (QoS, retain, will, session state, reconexão resiliente, buffers offline) e segurança end-to-end com TLS/mTLS.',
          'Integração Modbus TCP/RTU, análise de hardware, depuração e validação ponta a ponta.',
          'Pipelines de aquisição/normalização de telemetria via APIs assíncronas, mensageria MQTT e WebSockets.',
          'OTA bootloader dual-bank, rollback seguro e validação criptográfica.',
          'Uso de VSCode/PlatformIO, análise estática, cobertura, serial monitor e CI/CD de firmware.',
        ],
      },
    },
    {
      company: 'Companytec Automação e Controle Ltda',
      role: 'Analista de Suporte Técnico',
      period: 'outubro de 2019 — março de 2022 (2 anos 6 meses)',
      location: 'Pelotas, Rio Grande do Sul, Brasil',
      highlights: [
        'Implemento de protocolo MQTT (mensageria PUB/SUB) para comunicação entre hardware e sistema de captura de pagamentos via nuvem.',
        'Projeto e execução de rotinas de testes de confiabilidade para componentes de hardware e software.',
        'Criação de manuais operacionais detalhados para os produtos.',
        'Suporte técnico, incluindo diagnóstico, manutenção e implementação de projetos in loco.',
        'Desenvolvimento de programas de treinamento de funcionários para os produtos da empresa.',
        'Contribuição para projetos de P&D em hardware e software.',
        'Documentação de protocolos para bombas, dispensadores e medidores de tanque TLS.',
      ],
    },
    {
      company: 'Companytec Automação e Controle Ltda',
      role: 'Técnico em eletrônica',
      period: 'outubro de 2014 — outubro de 2019 (5 anos 1 mês)',
      location: 'Pelotas, Rio Grande do Sul, Brasil',
      highlights: [
        'Programação de scripts para equipamentos SMD/THT como laser, impressora de solda, pick and place machine (PANASONIC, MIRAE, etc.).',
        'Reparo, teste e inspeção de circuitos eletrônicos SMD e THT de 100% dos produtos da empresa.',
        'Desenvolvimento de instruções técnicas para uso no setor produtivo.',
        'Prototipagem de placas de circuito impresso utilizando máquina de prototipagem CNC.',
      ],
    },
    {
      company: 'Argus Agro Industrial Ltda.',
      role: 'Técnico em eletrônica',
      period: 'março de 2012 — abril de 2014 (2 anos 2 meses)',
      location: 'Pelotas, Rio Grande do Sul, Brasil',
      highlights: [
        'Assistência técnica em seletor eletrônico de grãos em todo território nacional.',
        'Treinamento de funcionários (10+ grandes indústrias, dezenas de colaboradores).',
        'Reporte periódico direto ao CPO da Amd Sortex para desenvolvimento e adequação do produto à norma brasileira.',
        'Prospecção de clientes, gestão de estoque e abastecimento para B2B.',
      ],
    },
  ],
  education: [
    {
      institution: 'Universidade Católica de Pelotas',
      degree: 'Pós-graduação Lato Sensu, Inteligência Artificial e Machine Learning',
      period: 'maio de 2026 — maio de 2027',
    },
    {
      institution: 'Universidade Católica de Pelotas',
      degree: 'Curso Superior de Tecnologia (CST), Análise de Sistemas de Computação',
      period: 'dezembro de 2022 — dezembro de 2024',
    },
    {
      institution: 'IFSUL - Instituto Federal Sul-rio-grandense',
      degree: 'Curso Técnico Integrado, Eletrônica',
      period: 'julho de 2007 — novembro de 2011',
    },
  ],
};

export function getExperienceFor(company: string, role?: string): ExperienceDetail | undefined {
  return profile.experienceDetails.find(
    (d) => d.company === company && (role === undefined || d.role === role),
  );
}