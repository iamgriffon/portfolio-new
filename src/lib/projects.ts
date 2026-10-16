export const projects = [
  {
    id: "whackamole",
    name: "Hacked Whack-a-Mole",
    image: "/projects/hacked-whackamole.png",
    repository: "https://github.com/iamgriffon/hacked-whackamole",
    demo: "https://iamgriffon.github.io/hacked-whackamole/",
    technologies: ["TensorFlow.js", "JavaScript", "Canvas", "Web Workers"],
  },
  {
    id: "matchmaker",
    name: "Vestibulandos · AI Student Matchmaker",
    image: "/projects/ai-student-matchmaker.png",
    repository: "https://github.com/iamgriffon/ai-student-matchmaker",
    demo: "https://vestibulandos.guusilveira.workers.dev/",
    technologies: ["TensorFlow.js", "Cloudflare Workers", "D1", "Vectorize"],
  },
] as const;
