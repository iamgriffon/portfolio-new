// Add a utility function to check if an icon exists
const validateIconPath = (iconPath: string) => {
  // If icon starts with / but not /icons/, add /icons/ prefix
  if (iconPath && iconPath.startsWith('/') && !iconPath.startsWith('/icons/')) {
    return `/icons${iconPath}`;
  }
  
  // Use a default icon if none is provided
  if (!iconPath) {
    return '/icons/generic-tech.svg'; // Make sure this file exists in your public/icons directory
  }
  
  return iconPath;
};

export const techs = [
  { id: "typescript", name: "TypeScript", icon: "/icons/typescript.svg", level: 100, years: 5 },
  { id: "javascript", name: "JavaScript", icon: "/icons/javascript.svg", level: 100, years: 5 },
  { id: "html", name: "HTML", icon: "/icons/html.svg", level: 100, years: 5 },
  { id: "css", name: "CSS", icon: "/icons/css.svg", level: 100, years: 5 },
  { id: "react", name: "React", icon: "/icons/react.svg", level: 100, years: 5 },
  { id: "react-native", name: "React Native", icon: "/icons/react-native.svg", level: 95, years: 4 },
  { id: "next", name: "Next.js", icon: "/icons/nextjs.svg", level: 100, years: 5 },
  { id: "angular", name: "Angular", icon: "/icons/angular.svg", level: 85, years: 2 },
  { id: "vue", name: "Vue.js", icon: "/icons/vue.svg", level: 90, years: 3 },
  { id: "express", name: "Express.js", icon: "/icons/express.svg", level: 100, years: 5 },
  { id: "fastify", name: "Fastify", icon: "/icons/fastify.svg", level: 90, years: 3 },
  { id: "node", name: "Node.js", icon: "/icons/nodejs.svg", level: 95, years: 5 },
  { id: "nest", name: "Nest.js", icon: "/icons/nestjs.svg", level: 90, years: 2 },
  { id: "git", name: "Git", icon: "/icons/git.svg", level: 95, years: 5 },
  { id: "docker", name: "Docker", icon: "/icons/docker.svg", level: 85, years: 5 },
  { id: "php", name: "PHP", icon: "/icons/php.svg", level: 70, years: 1.5 },
  { id: "java", name: "Java", icon: "/icons/java.svg", level: 70, years: 2 },
  { id: "csharp", name: "C#", icon: "/icons/csharp.svg", level: 75, years: 2 },
  { id: "python", name: "Python", icon: "/icons/python.svg", level: 60, years: 1.5 },
].map(tech => ({
  ...tech,
  icon: validateIconPath(tech.icon)
}));
