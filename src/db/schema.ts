import { Database } from "sqlite3";
import { open } from "sqlite";

export async function initializeDatabase() {
  const db = await open({
    filename: "./src/db/resume.db",
    driver: Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS job_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      en_position TEXT NOT NULL,
      ptbr_position TEXT NOT NULL,
      zh_position TEXT NOT NULL,
      start_date TEXT NOT NULL,
      image_url TEXT,
      end_date TEXT,
      technologies TEXT,
      achievements TEXT,
      url TEXT,
      order_index INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution TEXT NOT NULL,
      en_degree TEXT NOT NULL,
      ptbr_degree TEXT NOT NULL,
      zh_degree TEXT NOT NULL,
      start_date TEXT NOT NULL,
      image_url TEXT,
      end_date TEXT,
      en_achievements TEXT,
      ptbr_achievements TEXT,
      zh_achievements TEXT,
      technologies TEXT,
      url TEXT,
      order_index INTEGER,
      degree_url TEXT
    );
  `);
  // Insert sample data if tables are empty
  const jobCount = await db.get("SELECT COUNT(*) as count FROM job_history");
  if (jobCount.count === 0) {
    await db.exec(`
      INSERT INTO job_history (company, en_position, ptbr_position, zh_position, start_date, end_date, technologies, url, order_index, image_url)
      VALUES 
        ('Órulo', 'Mid Level Web Developer', 'Desenvolvedor Front-end Pleno', '前端开发工程师', '2024-04', '2025-02', 'Docker, React, React Native, Next.js, TypeScript, jQuery, Playwright, Storybook, Design System, Tailwind CSS, Node.js', 'https://orulo.com.br', 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRganStCaJVuvkaalv_s311q7oPmtey395nJQ&s'),
        ('WebHub', 'Mid Level Web Developer', 'Desenvolvedor Front-end Pleno', '前端开发工程师', '2023-04', '2024-03', 'Docker, React, Expo, React Native, Next.js, TypeScript, Cypress, Laravel, Design System, Tailwind CSS, Node.js', 'https://webhub.com.br', 2, 'https://media.licdn.com/dms/image/v2/C4D0BAQEEYpBNCruDIQ/company-logo_200_200/company-logo_200_200/0/1631371717016/webhubbr_logo?e=2147483647&v=beta&t=CTUlrW9noIY4NFxqP8Xqe-IRTFLVeyk4pIqd6khB00Q'),
        ('PayPal', 'Integration Specialist', 'Especialista em Integração', '专家在集成', '2020-11', '2022-12', 'Javascript, Zendesk, Salesforce, Sumo, and Slack', 'https://paypal.com', 3, 'https://thedigitalbanker.com/wp-content/uploads/2023/08/paypal-paypal-icon-paypal-logo-3384015.png'),
        ('Agilizeware', 'Full Stack Junior Developer', 'Desenvolvedor Full Stack Júnior', '全栈初级开发工程师', '2020-07', '2020-11', 'Javascript, React, Node, jQuery, EJS, SQL, Express, Node.js', 'https://www.instagram.com/agilizewarebrasil/', 4, 'https://media.licdn.com/dms/image/v2/C560BAQEzq5hPWTcoOw/company-logo_200_200/company-logo_200_200/0/1631370695251?e=1750291200&v=beta&t=YSWNywt00sfTHGhJ9CB27M1qUS0ADieJlV2-_olmFng');
    `);
  }

  const eduCount = await db.get("SELECT COUNT(*) as count FROM education");
  if (eduCount.count === 0) {
    await db.exec(`
      INSERT INTO education (institution, en_degree, ptbr_degree, zh_degree, start_date, end_date, en_achievements, ptbr_achievements, zh_achievements, url, order_index, degree_url, technologies)
      VALUES 
        ('FATEC Ipiranga', 'Bachelor of Science in Information Technology', 'Bacharel em Análise e Desenvolvimento de Sistemas', '信息技术学士学位', '2019-07', '2024-06', 'Focus on software engineering and algorithms with approval in final project as a solo developer and GPA above 8 (10 being the highest)', 'Foco em engenharia de software e algoritmos com aprovação em projeto final como desenvolvedor solo e CR acima de 8', '专注于软件工程和算法，并获得荣誉学位', 'https://fatecipiranga.edu.br', 1, NULL, 'Angular, Flutter, React, Agile, OracleDB, MongoDB, Java, Spring Boot, JUnit, C, C++, SQL, Git, Python, Anaconda, ITIL/Cobit, Assembly, Figma, Data Structure, UML, Data Modeling, Algorithms, MVC/MVC-DAO'),
        ('Udemy', 'Django Full Stack Web Development Bootcamp', 'Bootcamp de Desenvolvimento Web Full Stack com Django', 'Django全栈Web开发课程', '2019-11', '2019-12', 'Created portfolio project that uses machine learning', 'Criado projeto de portfólio que usa aprendizado de máquina', '创建了一个使用机器学习的项目组合项目', 'https://udemy.com', 2, 'https://udemy-certificate.s3.amazonaws.com/pdf/UC-KLTSERHC.pdf', 'HTML, CSS, JavaScript, Python, Django, PostgreSQL, Git, AWS'),
        ('Udemy', 'Complete React Developer (w/ Redux, Hooks, GraphQL)', 'Desenvolvedor React Completo (com Redux, Hooks, GraphQL)', '全面React开发课程（含Redux、Hooks、GraphQL）', '2025-02', '2025-03', 'Comprehensive React course with end-to-end project deployment', 'Curso completo de React com deploy de projeto ponta a ponta', '包含从零到部署的实战项目的完整React课程', 'https://udemy.com', 3, 'https://udemy-certificate.s3.amazonaws.com/pdf/UC-11a0d365-5460-4c7d-af36-e0dce71b09a4.pdf', 'HTML, CSS, JavaScript, Typescript, React, Redux, Hooks, GraphQL, Node.js, Express, Firebase, Auth0, Netlify, Serverless, Git, AWS')
      `);
  }

  return db;
}

// Database access functions
export async function getJobHistory() {
  const db = await open({
    filename: "./src/db/resume.db",
    driver: Database,
  });

  return db.all("SELECT * FROM job_history ORDER BY order_index ASC");
}

export async function getEducation() {
  const db = await open({
    filename: "./src/db/resume.db",
    driver: Database,
  });

  return db.all("SELECT * FROM education ORDER BY order_index ASC");
}
