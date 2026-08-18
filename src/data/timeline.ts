import type { Locale } from '../i18n/ui';

export interface TimelineEntry {
  role: string;
  company: string;
  period: string;
  current?: boolean;
  summary: string;
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

export interface TimelineData {
  careerJourney: TimelineEntry[];
  experienceDetails: ExperienceDetail[];
  education: EducationEntry[];
}

// Fonte única da trajetória — localizada por idioma (extraído de add-data.json).
// careerJourney ordenado do mais recente ao mais antigo (período inicial desc;
// "current" indica o item em andamento e substitui a checagem de string do
// período para "presente", que varia entre idiomas).
export const timeline: Record<Locale, TimelineData> = {
  pt: {
    careerJourney: [
      {
        role: "Pós-graduação, Inteligência Artificial e Machine Learning",
        company: "Universidade Católica de Pelotas",
        period: "maio de 2026 — maio de 2027",
        summary: "Especialização em IA e ML aplicada a engenharia de software.",
      },
      {
        role: "Software Developer",
        company: "CESS - Computational Energy Saving Solution",
        period: "dezembro de 2022 — presente",
        current: true,
        summary:
          "Desenvolvimento full stack e IoT para plataformas de eficiência energética.",
      },
      {
        role: "CST, Análise de Sistemas de Computação",
        company: "Universidade Católica de Pelotas",
        period: "dezembro de 2022 — dezembro de 2024",
        summary:
          "Graduação tecnológica em análise e desenvolvimento de sistemas.",
      },
      {
        role: "Analista de Suporte Técnico",
        company: "Companytec Automação e Controle Ltda",
        period: "outubro de 2019 — março de 2022",
        summary:
          "Suporte técnico, testes de confiabilidade e implementação de MQTT entre hardware e nuvem.",
      },
      {
        role: "Técnico em eletrônica",
        company: "Companytec Automação e Controle Ltda",
        period: "outubro de 2014 — outubro de 2019",
        summary:
          "Reparo, teste e inspeção de circuitos eletrônicos SMD/THT e automação de produção.",
      },
      {
        role: "Técnico em eletrônica",
        company: "Argus Agro Industrial Ltda.",
        period: "março de 2012 — abril de 2014",
        summary:
          "Assistência técnica em seletores eletrônicos de grãos em todo o território nacional.",
      },
      {
        role: "Curso Técnico Integrado, Eletrônica",
        company: "IFSUL - Instituto Federal Sul-rio-grandense",
        period: "julho de 2007 — novembro de 2011",
        summary: "Formação técnica integrada em eletrônica.",
      },
    ],
    experienceDetails: [
      {
        company: "CESS - Computational Energy Saving Solution",
        role: "Software Developer",
        period: "dezembro de 2022 — presente (3 anos 9 meses)",
        location: "Rio Grande do Sul, Brasil",
        highlights: {
          frontend: [
            "Arquitetura utilizando React, Next.js, Vite e Tailwind (SSR/SSG/RSC), otimizações de bundle, code-splitting lazy-loading e TypeScript avançado.",
            "Data-layer com React Query, Redux, Zustand e Context API, e custom hooks.",
            "Dashboards em tempo real via WebSockets/SignalR, incluindo telemetria, gráficos e comandos remotos.",
            "Módulos de relatórios (PDF, Excel, CSV) integrados a pipelines de dados.",
            "Design systems, Storybook, tokens de design e testes visuais para padronização entre squads.",
            "Autenticação/Autorização (JWT, OAuth2/OIDC), proteção XSS/CSRF e hardening de headers.",
            "Modernização de aplicações legadas (HTML/CSS/JS/Bootstrap), foco em performance e acessibilidade.",
          ],
          backend: [
            "APIs assíncronas de alta performance em Python (FastAPI/Django), aplicando Clean Architecture.",
            "Governança de APIs: OpenAPI, Pydantic, validação forte, ORMs assíncronos, dependency injection e background tasks.",
            "Broker MQTT contêinerizado com autenticação, ACLs, mTLS/TLS e gestão de certificados.",
            "Pipelines assíncronos de telemetria (~100 msgs/min) com particionamento, batching, idempotência, backpressure e autoscaling.",
            "PostgreSQL/time-series: modelagem, indexação, partitioning temporal, tuning, migrations (Alembic) e async pooling.",
            "Docker, automação de builds, secrets management, CI/CD (GitHub Actions), logging estruturado, tracing e observabilidade.",
          ],
          embeddedAndIot: [
            "Firmwares em C++ e FreeRTOS multitarefa, gerenciamento de memória, drivers e otimização de consumo/real-time.",
            "Comunicação MQTT (QoS, retain, will, session state, reconexão resiliente, buffers offline) e segurança end-to-end com TLS/mTLS.",
            "Integração Modbus TCP/RTU, análise de hardware, depuração e validação ponta a ponta.",
            "Pipelines de aquisição/normalização de telemetria via APIs assíncronas, mensageria MQTT e WebSockets.",
            "OTA bootloader dual-bank, rollback seguro e validação criptográfica.",
            "Uso de VSCode/PlatformIO, análise estática, cobertura, serial monitor e CI/CD de firmware.",
          ],
        },
      },
      {
        company: "Companytec Automação e Controle Ltda",
        role: "Analista de Suporte Técnico",
        period: "outubro de 2019 — março de 2022 (2 anos 6 meses)",
        location: "Pelotas, Rio Grande do Sul, Brasil",
        highlights: [
          "Implemento de protocolo MQTT (mensageria PUB/SUB) para comunicação entre hardware e sistema de captura de pagamentos via nuvem.",
          "Projeto e execução de rotinas de testes de confiabilidade para componentes de hardware e software.",
          "Criação de manuais operacionais detalhados para os produtos.",
          "Suporte técnico, incluindo diagnóstico, manutenção e implementação de projetos in loco.",
          "Desenvolvimento de programas de treinamento de funcionários para os produtos da empresa.",
          "Contribuição para projetos de P&D em hardware e software.",
          "Documentação de protocolos para bombas, dispensadores e medidores de tanque TLS.",
        ],
      },
      {
        company: "Companytec Automação e Controle Ltda",
        role: "Técnico em eletrônica",
        period: "outubro de 2014 — outubro de 2019 (5 anos 1 mês)",
        location: "Pelotas, Rio Grande do Sul, Brasil",
        highlights: [
          "Programação de scripts para equipamentos SMD/THT como laser, impressora de solda, pick and place machine (PANASONIC, MIRAE, etc.).",
          "Reparo, teste e inspeção de circuitos eletrônicos SMD e THT de 100% dos produtos da empresa.",
          "Desenvolvimento de instruções técnicas para uso no setor produtivo.",
          "Prototipagem de placas de circuito impresso utilizando máquina de prototipagem CNC.",
        ],
      },
      {
        company: "Argus Agro Industrial Ltda.",
        role: "Técnico em eletrônica",
        period: "março de 2012 — abril de 2014 (2 anos 2 meses)",
        location: "Pelotas, Rio Grande do Sul, Brasil",
        highlights: [
          "Assistência técnica em seletor eletrônico de grãos em todo território nacional.",
          "Treinamento de funcionários (10+ grandes indústrias, dezenas de colaboradores).",
          "Reporte periódico direto ao CPO da Amd Sortex para desenvolvimento e adequação do produto à norma brasileira.",
          "Prospecção de clientes, gestão de estoque e abastecimento para B2B.",
        ],
      },
    ],
    education: [
      {
        institution: "Universidade Católica de Pelotas",
        degree:
          "Pós-graduação Lato Sensu, Inteligência Artificial e Machine Learning",
        period: "maio de 2026 — maio de 2027",
      },
      {
        institution: "Universidade Católica de Pelotas",
        degree:
          "Curso Superior de Tecnologia (CST), Análise de Sistemas de Computação",
        period: "dezembro de 2022 — dezembro de 2024",
      },
      {
        institution: "IFSUL - Instituto Federal Sul-rio-grandense",
        degree: "Curso Técnico Integrado, Eletrônica",
        period: "julho de 2007 — novembro de 2011",
      },
    ],
  },
  es: {
    careerJourney: [
      {
        role: "Posgrado, Inteligencia Artificial y Machine Learning",
        company: "Universidade Católica de Pelotas",
        period: "mayo de 2026 — mayo de 2027",
        summary: "Especialización en IA y ML aplicada a la ingeniería de software.",
      },
      {
        role: "Software Developer",
        company: "CESS - Computational Energy Saving Solution",
        period: "diciembre de 2022 — presente",
        current: true,
        summary:
          "Desarrollo full stack e IoT para plataformas de eficiencia energética.",
      },
      {
        role: "CST, Análisis de Sistemas de Computación",
        company: "Universidade Católica de Pelotas",
        period: "diciembre de 2022 — diciembre de 2024",
        summary:
          "Titulación tecnológica en análisis y desarrollo de sistemas.",
      },
      {
        role: "Analista de Soporte Técnico",
        company: "Companytec Automação e Controle Ltda",
        period: "octubre de 2019 — marzo de 2022",
        summary:
          "Soporte técnico, pruebas de fiabilidad e implementación de MQTT entre hardware y nube.",
      },
      {
        role: "Técnico en electrónica",
        company: "Companytec Automação e Controle Ltda",
        period: "octubre de 2014 — octubre de 2019",
        summary:
          "Reparación, prueba e inspección de circuitos electrónicos SMD/THT y automatización de producción.",
      },
      {
        role: "Técnico en electrónica",
        company: "Argus Agro Industrial Ltda.",
        period: "marzo de 2012 — abril de 2014",
        summary:
          "Asistencia técnica en seleccionadores electrónicos de granos en todo el territorio nacional.",
      },
      {
        role: "Curso Técnico Integrado, Electrónica",
        company: "IFSUL - Instituto Federal Sul-rio-grandense",
        period: "julio de 2007 — noviembre de 2011",
        summary: "Formación técnica integrada en electrónica.",
      },
    ],
    experienceDetails: [
      {
        company: "CESS - Computational Energy Saving Solution",
        role: "Software Developer",
        period: "diciembre de 2022 — presente (3 años 9 meses)",
        location: "Rio Grande do Sul, Brasil",
        highlights: {
          frontend: [
            "Arquitectura con React, Next.js, Vite y Tailwind (SSR/SSG/RSC), optimizaciones de bundle, code-splitting lazy-loading y TypeScript avanzado.",
            "Data-layer con React Query, Redux, Zustand y Context API, y custom hooks.",
            "Dashboards en tiempo real vía WebSockets/SignalR, incluyendo telemetría, gráficos y comandos remotos.",
            "Módulos de informes (PDF, Excel, CSV) integrados con pipelines de datos.",
            "Design systems, Storybook, design tokens y pruebas visuales para estandarizar entre squads.",
            "Autenticación/Autorización (JWT, OAuth2/OIDC), protección XSS/CSRF y hardening de headers.",
            "Modernización de aplicaciones legadas (HTML/CSS/JS/Bootstrap), foco en rendimiento y accesibilidad.",
          ],
          backend: [
            "APIs asíncronas de alto rendimiento en Python (FastAPI/Django), aplicando Clean Architecture.",
            "Gobernanza de APIs: OpenAPI, Pydantic, validación fuerte, ORMs asíncronos, dependency injection y background tasks.",
            "Broker MQTT contenedorizado con autenticación, ACLs, mTLS/TLS y gestión de certificados.",
            "Pipelines asíncronos de telemetría (~100 msgs/min) con particionado, batching, idempotencia, backpressure y autoscaling.",
            "PostgreSQL/time-series: modelado, indexación, particionado temporal, tuning, migraciones (Alembic) y async pooling.",
            "Docker, automatización de builds, secrets management, CI/CD (GitHub Actions), logging estructurado, tracing y observabilidad.",
          ],
          embeddedAndIot: [
            "Firmwares en C++ y FreeRTOS multitarea, gestión de memoria, drivers y optimización de consumo/real-time.",
            "Comunicación MQTT (QoS, retain, will, session state, reconexión resiliente, buffers offline) y seguridad end-to-end con TLS/mTLS.",
            "Integración Modbus TCP/RTU, análisis de hardware, depuración y validación de extremo a extremo.",
            "Pipelines de adquisición/normalización de telemetría vía APIs asíncronas, mensajería MQTT y WebSockets.",
            "OTA bootloader dual-bank, rollback seguro y validación criptográfica.",
            "Uso de VSCode/PlatformIO, análisis estático, cobertura, serial monitor y CI/CD de firmware.",
          ],
        },
      },
      {
        company: "Companytec Automação e Controle Ltda",
        role: "Analista de Soporte Técnico",
        period: "octubre de 2019 — marzo de 2022 (2 años 6 meses)",
        location: "Pelotas, Rio Grande do Sul, Brasil",
        highlights: [
          "Implementación del protocolo MQTT (mensajería PUB/SUB) para la comunicación entre hardware y el sistema de captura de pagos vía nube.",
          "Diseño y ejecución de rutinas de pruebas de fiabilidad para componentes de hardware y software.",
          "Creación de manuales operativos detallados para los productos.",
          "Soporte técnico, incluyendo diagnóstico, mantenimiento e implementación de proyectos in situ.",
          "Desarrollo de programas de capacitación de empleados para los productos de la empresa.",
          "Contribución a proyectos de I+D en hardware y software.",
          "Documentación de protocolos para bombas, dispensadores y medidores de tanque TLS.",
        ],
      },
      {
        company: "Companytec Automação e Controle Ltda",
        role: "Técnico en electrónica",
        period: "octubre de 2014 — octubre de 2019 (5 años 1 mes)",
        location: "Pelotas, Rio Grande do Sul, Brasil",
        highlights: [
          "Programación de scripts para equipos SMD/THT como láser, impresora de soldadura, pick and place machine (PANASONIC, MIRAE, etc.).",
          "Reparación, prueba e inspección de circuitos electrónicos SMD y THT del 100% de los productos de la empresa.",
          "Desarrollo de instrucciones técnicas para uso en el sector productivo.",
          "Prototipado de placas de circuito impreso con máquina de prototipado CNC.",
        ],
      },
      {
        company: "Argus Agro Industrial Ltda.",
        role: "Técnico en electrónica",
        period: "marzo de 2012 — abril de 2014 (2 años 2 meses)",
        location: "Pelotas, Rio Grande do Sul, Brasil",
        highlights: [
          "Asistencia técnica en seleccionador electrónico de granos en todo el territorio nacional.",
          "Capacitación de empleados (10+ grandes industrias, decenas de colaboradores).",
          "Reporte periódico directo al CPO de Amd Sortex para el desarrollo y adecuación del producto a la norma brasileña.",
          "Prospección de clientes, gestión de inventario y abastecimiento para B2B.",
        ],
      },
    ],
    education: [
      {
        institution: "Universidade Católica de Pelotas",
        degree: "Posgrado Lato Sensu, Inteligencia Artificial y Machine Learning",
        period: "mayo de 2026 — mayo de 2027",
      },
      {
        institution: "Universidade Católica de Pelotas",
        degree:
          "Curso Superior de Tecnología (CST), Análisis de Sistemas de Computación",
        period: "diciembre de 2022 — diciembre de 2024",
      },
      {
        institution: "IFSUL - Instituto Federal Sul-rio-grandense",
        degree: "Curso Técnico Integrado, Electrónica",
        period: "julio de 2007 — noviembre de 2011",
      },
    ],
  },
  en: {
    careerJourney: [
      {
        role: "Postgraduate, Artificial Intelligence and Machine Learning",
        company: "Universidade Católica de Pelotas",
        period: "May 2026 — May 2027",
        summary: "Specialization in AI and ML applied to software engineering.",
      },
      {
        role: "Software Developer",
        company: "CESS - Computational Energy Saving Solution",
        period: "December 2022 — present",
        current: true,
        summary: "Full stack and IoT development for energy efficiency platforms.",
      },
      {
        role: "CST, Computer Systems Analysis",
        company: "Universidade Católica de Pelotas",
        period: "December 2022 — December 2024",
        summary: "Technology degree in systems analysis and development.",
      },
      {
        role: "Technical Support Analyst",
        company: "Companytec Automação e Controle Ltda",
        period: "October 2019 — March 2022",
        summary:
          "Technical support, reliability testing and MQTT implementation between hardware and cloud.",
      },
      {
        role: "Electronics Technician",
        company: "Companytec Automação e Controle Ltda",
        period: "October 2014 — October 2019",
        summary:
          "Repair, testing and inspection of SMD/THT electronic circuits and production automation.",
      },
      {
        role: "Electronics Technician",
        company: "Argus Agro Industrial Ltda.",
        period: "March 2012 — April 2014",
        summary:
          "Field technical assistance on electronic grain sorters across the country.",
      },
      {
        role: "Integrated Technical Course, Electronics",
        company: "IFSUL - Instituto Federal Sul-rio-grandense",
        period: "July 2007 — November 2011",
        summary: "Integrated technical training in electronics.",
      },
    ],
    experienceDetails: [
      {
        company: "CESS - Computational Energy Saving Solution",
        role: "Software Developer",
        period: "December 2022 — present (3 years 9 months)",
        location: "Rio Grande do Sul, Brazil",
        highlights: {
          frontend: [
            "Architecture using React, Next.js, Vite and Tailwind (SSR/SSG/RSC), bundle optimizations, code-splitting lazy-loading and advanced TypeScript.",
            "Data layer with React Query, Redux, Zustand and Context API, and custom hooks.",
            "Real-time dashboards via WebSockets/SignalR, including telemetry, charts and remote commands.",
            "Reporting modules (PDF, Excel, CSV) integrated with data pipelines.",
            "Design systems, Storybook, design tokens and visual tests to standardize across squads.",
            "Authentication/Authorization (JWT, OAuth2/OIDC), XSS/CSRF protection and header hardening.",
            "Modernization of legacy applications (HTML/CSS/JS/Bootstrap), focused on performance and accessibility.",
          ],
          backend: [
            "High-performance async APIs in Python (FastAPI/Django), applying Clean Architecture.",
            "API governance: OpenAPI, Pydantic, strong validation, async ORMs, dependency injection and background tasks.",
            "Containerized MQTT broker with authentication, ACLs, mTLS/TLS and certificate management.",
            "Async telemetry pipelines (~100 msgs/min) with partitioning, batching, idempotency, backpressure and autoscaling.",
            "PostgreSQL/time-series: modeling, indexing, temporal partitioning, tuning, migrations (Alembic) and async pooling.",
            "Docker, build automation, secrets management, CI/CD (GitHub Actions), structured logging, tracing and observability.",
          ],
          embeddedAndIot: [
            "Firmware in C++ and FreeRTOS multitasking, memory management, drivers and power/real-time optimization.",
            "MQTT communication (QoS, retain, will, session state, resilient reconnection, offline buffers) and end-to-end security with TLS/mTLS.",
            "Modbus TCP/RTU integration, hardware analysis, debugging and end-to-end validation.",
            "Telemetry acquisition/normalization pipelines via async APIs, MQTT messaging and WebSockets.",
            "OTA dual-bank bootloader, safe rollback and cryptographic validation.",
            "VSCode/PlatformIO usage, static analysis, coverage, serial monitor and firmware CI/CD.",
          ],
        },
      },
      {
        company: "Companytec Automação e Controle Ltda",
        role: "Technical Support Analyst",
        period: "October 2019 — March 2022 (2 years 6 months)",
        location: "Pelotas, Rio Grande do Sul, Brazil",
        highlights: [
          "MQTT protocol implementation (PUB/SUB messaging) for communication between hardware and a cloud-based payment capture system.",
          "Design and execution of reliability test routines for hardware and software components.",
          "Creation of detailed operational manuals for the products.",
          "Technical support, including diagnosis, maintenance and on-site project implementation.",
          "Development of employee training programs for the company's products.",
          "Contribution to R&D projects in hardware and software.",
          "Documentation of protocols for pumps, dispensers and TLS tank gauges.",
        ],
      },
      {
        company: "Companytec Automação e Controle Ltda",
        role: "Electronics Technician",
        period: "October 2014 — October 2019 (5 years 1 month)",
        location: "Pelotas, Rio Grande do Sul, Brazil",
        highlights: [
          "Script programming for SMD/THT equipment such as laser, solder printer and pick and place machine (PANASONIC, MIRAE, etc.).",
          "Repair, testing and inspection of SMD and THT electronic circuits of 100% of the company's products.",
          "Development of technical instructions for use in the production sector.",
          "Printed circuit board prototyping using a CNC prototyping machine.",
        ],
      },
      {
        company: "Argus Agro Industrial Ltda.",
        role: "Electronics Technician",
        period: "March 2012 — April 2014 (2 years 2 months)",
        location: "Pelotas, Rio Grande do Sul, Brazil",
        highlights: [
          "Field technical assistance on electronic grain sorters across the country.",
          "Employee training (10+ major industries, dozens of collaborators).",
          "Direct periodic reporting to the CPO of Amd Sortex for product development and compliance with Brazilian standards.",
          "Client prospecting, inventory management and supply for B2B.",
        ],
      },
    ],
    education: [
      {
        institution: "Universidade Católica de Pelotas",
        degree:
          "Lato Sensu Postgraduate, Artificial Intelligence and Machine Learning",
        period: "May 2026 — May 2027",
      },
      {
        institution: "Universidade Católica de Pelotas",
        degree: "Higher Technology Course (CST), Computer Systems Analysis",
        period: "December 2022 — December 2024",
      },
      {
        institution: "IFSUL - Instituto Federal Sul-rio-grandense",
        degree: "Integrated Technical Course, Electronics",
        period: "July 2007 — November 2011",
      },
    ],
  },
};

export function getTimeline(locale: Locale): TimelineData {
  return timeline[locale];
}

export function getExperienceFor(
  locale: Locale,
  company: string,
  role?: string,
): ExperienceDetail | undefined {
  return timeline[locale].experienceDetails.find(
    (d) => d.company === company && (role === undefined || d.role === role),
  );
}
