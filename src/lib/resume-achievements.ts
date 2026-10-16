import type { ResumeLocale } from "./resume-data";

// Based on the owner’s account of delivered work. See docs/resume-cv.md.
// Keyed by company, never by ordering or a database-generated identifier.
const ticketbolt: Record<ResumeLocale, string[]> = {
  "pt-BR": [
    "Arquiteturei a infraestrutura da Ticketbolt para sustentar a plataforma de venda e gestão de ingressos na web e no mobile.",
    "Desenvolvi o backoffice para operação da plataforma, reunindo métricas, permissionamento, gestão de eventos e usuários, integração com pagamentos, feature flags e gestão de documentos.",
    "Implementei a jornada de e-commerce, da landing page à fila e ao checkout, incluindo autenticação e mapa de palco em tempo real na web e no mobile.",
    "Desenvolvi recursos de geração de ingressos, carteira e check-in, além de integrações com plataformas de apostas e validadores externos, cobrindo a compra, a disponibilização e a validação dos ingressos.",
    "Contribuí ativamente para a confiabilidade e a segurança da plataforma com testes unitários, de integração, end-to-end, de carga, estresse e performance, além de monitoramento, notificação de incidentes e reforço de segurança."
  ],
  "en": [
    "Architected Ticketbolt’s infrastructure to support its ticket sales and management platform across web and mobile.",
    "Developed the platform’s backoffice, bringing together metrics, access control, event and user management, payment integrations, feature flags and document management.",
    "Implemented the e-commerce journey from landing page through queue and checkout, including authentication and real-time venue seating maps on web and mobile.",
    "Developed ticket generation, wallet and check-in capabilities, alongside integrations with betting platforms and external validators, covering ticket purchase, delivery and validation.",
    "Actively contributed to platform reliability and security through unit, integration, end-to-end, load, stress and performance testing, as well as monitoring, incident notifications and security hardening."
  ],
  "es": [
    "Diseñé la arquitectura de infraestructura de Ticketbolt para sustentar su plataforma de venta y gestión de entradas en web y móvil.",
    "Desarrollé el backoffice de la plataforma, reuniendo métricas, control de permisos, gestión de eventos y usuarios, integración con pagos, feature flags y gestión de documentos.",
    "Implementé la experiencia de e-commerce desde la landing page hasta la cola y el checkout, incluyendo autenticación y mapas de asientos del recinto en tiempo real en web y móvil.",
    "Desarrollé funcionalidades de generación de entradas, cartera y check-in, además de integraciones con plataformas de apuestas y validadores externos, cubriendo la compra, entrega y validación de entradas.",
    "Contribuí activamente a la fiabilidad y seguridad de la plataforma con pruebas unitarias, de integración, end-to-end, de carga, estrés y rendimiento, además de monitorización, notificación de incidentes y refuerzo de seguridad."
  ],
  "zh": [
    "设计 Ticketbolt 的基础设施架构，支持 Web 和移动端的票务销售与管理平台。",
    "开发平台运营后台，涵盖指标、权限、活动与用户管理、支付集成、\n功能开关及文档管理。",
    "实现从落地页、排队到结账的电商流程，包括身份认证，\n以及 Web 和移动端的实时场地座位图。",
    "开发票券生成、票夹和入场核验功能，并集成投注平台及外部验证服务，\n覆盖票券购买、交付与验证环节。",
    "积极参与单元、集成、端到端、负载、压力及性能测试，\n并参与监控、事故通知和安全加固工作，支持平台可靠性与安全性。"
  ]
};

// Generic role summaries use only the existing roles and technology lists.
// PayPal also incorporates the owner’s direct account of integrations and migration.
const companyBullets: Record<string, Record<ResumeLocale, string[]>> = {
  ticketbolt,
  "órulo": {
    "pt-BR": [
      "Atuei no desenvolvimento front-end de aplicações web com React, Next.js e TypeScript, utilizando componentes de interface e design system."
    ],
    "en": [
      "Worked on frontend development for web applications with React, Next.js and TypeScript, using UI components and a design system."
    ],
    "es": [
      "Participé en el desarrollo front-end de aplicaciones web con React, Next.js y TypeScript, utilizando componentes de interfaz y un sistema de diseño."
    ],
    "zh": [
      "参与基于 React、Next.js 和 TypeScript 的 Web 前端开发，\n使用界面组件和设计系统。"
    ]
  },
  "webhub": {
    "pt-BR": [
      "Atuei no desenvolvimento de interfaces para aplicações web e mobile com React, Next.js, React Native e TypeScript."
    ],
    "en": [
      "Worked on interface development for web and mobile applications with React, Next.js, React Native and TypeScript."
    ],
    "es": [
      "Participé en el desarrollo de interfaces para aplicaciones web y móviles con React, Next.js, React Native y TypeScript."
    ],
    "zh": [
      "参与 Web 和移动应用的界面开发，\n使用 React、Next.js、React Native 和 TypeScript。"
    ]
  },
  "paypal": {
    "pt-BR": [
      "Atuei na integração de grandes clientes às soluções do PayPal.",
      "Participei do processo de descontinuação (sunset) do sistema de carteira e da migração para soluções de pagamento."
    ],
    "en": [
      "Worked on integrating large clients with PayPal solutions.",
      "Participated in sunsetting the wallet system and migrating to payment solutions."
    ],
    "es": [
      "Trabajé en la integración de grandes clientes con las soluciones de PayPal.",
      "Participé en la descontinuación (sunset) del sistema de cartera y en la migración a soluciones de pago."
    ],
    "zh": [
      "参与大型客户与 PayPal 解决方案的集成。",
      "参与钱包系统的停用及向支付解决方案的迁移。"
    ]
  },
  "agilizeware": {
    "pt-BR": [
      "Contribuí para o desenvolvimento full stack de aplicações web, trabalhando no front-end e no back-end com JavaScript, React, Node.js, Express e SQL."
    ],
    "en": [
      "Contributed to full-stack web application development, working on frontend and backend functionality with JavaScript, React, Node.js, Express and SQL."
    ],
    "es": [
      "Contribuí al desarrollo full stack de aplicaciones web, trabajando en el front-end y el back-end con JavaScript, React, Node.js, Express y SQL."
    ],
    "zh": [
      "参与 Web 应用的全栈开发，使用 JavaScript、React、Node.js、\nExpress 和 SQL 开发前端与后端功能。"
    ]
  }
};

export function resumeAchievements(company: string, locale: ResumeLocale): string[] {
  const key = company.trim().toLowerCase();
  const bullets = Object.hasOwn(companyBullets, key) ? companyBullets[key][locale] : [];
  return [...bullets];
}
