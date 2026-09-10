// Add a utility function to check if an icon exists
const validateIconPath = (iconPath: string) => {
  // If icon starts with / but not /icons/, add /icons/ prefix
  if (iconPath && iconPath.startsWith('/') && !iconPath.startsWith('/icons/')) {
    return `/icons${iconPath}`;
  }
  
  // Use a default icon if none is provided
  if (!iconPath) {
    return '/icons/cursor.svg'; // Using cursor.svg as the default icon
  }
  
  return iconPath;
};

export const techs = [
  { id: "typescript", name: "TypeScript", icon: "/typescript.svg", level: 96, years: 5 },
  { id: "javascript", name: "JavaScript", icon: "/javascript.svg", level: 96, years: 5 },
  { id: "html", name: "HTML", icon: "/html.svg", level: 95, years: 5 },
  { id: "css", name: "CSS", icon: "/css.svg", level: 95, years: 5 },
  { id: "react", name: "React", icon: "/react.svg", level: 96, years: 5 },
  { id: "nextjs", name: "Next.js", icon: "/next.svg", level: 95, years: 5 },
  { id: "react-native", name: "React Native", icon: "/react-native.svg", level: 85, years: 4 },
  { id: "node", name: "Node.js", icon: "/node-js.svg", level: 92, years: 5 },
  { id: "angular", name: "Angular", icon: "/angular.svg", level: 85, years: 2 },
  { id: "vue", name: "Vue.js", icon: "/vue.svg", level: 91, years: 3 },
  { id: "express", name: "Express.js", icon: "/express-js.svg", level: 93, years: 5 },
  { id: "nest", name: "Nest.js", icon: "/nest.svg", level: 93, years: 2 },
  { id: "git", name: "Git", icon: "/git.svg", level: 96, years: 5 },
  { id: "docker", name: "Docker", icon: "/docker.svg", level: 94, years: 5 },
  { id: "php", name: "PHP", icon: "/php.svg", level: 77, years: 1.5 },
  { id: "java", name: "Java", icon: "/java.svg", level: 77, years: 3 },
  { id: "csharp", name: "C#", icon: "/csharp.svg", level: 55, years: 2 },
  { id: "python", name: "Python", icon: "/python.svg", level: 55, years: 1.5 },
  { id: "aws", name: "AWS", icon: "/aws.svg", level: 82, years: 3 },
  { id: "sql", name: "SQL", icon: "/sql.svg", level: 94, years: 5 },
  { id: "mongodb", name: "MongoDB", icon: "/mongodb.svg", level: 90, years: 3 },
  { id: "jquery", name: "jQuery", icon: "/jquery.svg", level: 90, years: 5 },
  { id: "graphql", name: "GraphQL", icon: "/graphql.svg", level: 84, years: 4 },
].map(tech => ({
  ...tech,
  icon: validateIconPath(tech.icon)
}));
