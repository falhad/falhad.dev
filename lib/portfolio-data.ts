// Single source of truth for portfolio content.
// Both the 3D constellation and the 2D content/fallback components read from here,
// so the two never drift apart.

export type Project = {
  name: string
  tagline: string // short label for the 3D node
  description: string
  technologies: string[]
  links: { demo?: string; github?: string }
  // Position on the constellation, in world units. z is depth.
  position: [number, number, number]
  color: string // node hue
}

export type Experience = {
  company: string
  position: string
  location?: string
  date: string
  responsibilities: string[]
}

export type SkillCategory = {
  category: string
  items: string[]
}

export type Education = {
  degree: string
  institution: string
  location: string
  date: string
}

export type Certification = {
  name: string
  label: string
  url: string
}

export type AwardItem = {
  title: string
  description?: string
  years?: string[]
  url?: string
}

export const profile = {
  name: "Farhad Navayazdan",
  title: "Senior Software Developer",
  tagline: "I build fast, delightful software — from oil-rig monitoring to blockchain.",
  email: "cs.arcxx@gmail.com",
  phoneDisplay: "+968 90130747",
  phoneTel: "+96890130747",
  linkedin: "https://www.linkedin.com/in/farhadnava/",
  github: "https://github.com/falhad",
  avatar:
    "https://storage.rxresu.me/cm3e7oe3l00mgdbpo4c2nq7yn/pictures/cm3e7oe3l00mgdbpo4c2nq7yn.jpg",
  summary:
    "Innovative Senior Software Developer with over 11 years of experience delivering high-impact, scalable software solutions, including specialized applications for the oil and gas sector. Adept at solving complex technical challenges, optimizing system performance, and leading projects from concept to deployment.",
}

export const projects: Project[] = [
  {
    name: "RIG-AI",
    tagline: "AI rig monitoring",
    description:
      "AI-powered monitoring system for oil rigs, improving safety with real-time alerts and live video of rig activities.",
    technologies: ["Python", "TensorFlow", "React", "WebRTC"],
    links: { demo: "#", github: "#" },
    position: [-2.9, 3.0, -2],
    color: "#e879f9", // fuchsia
  },
  {
    name: "Biratex",
    tagline: "Crypto exchange",
    description:
      "Cryptocurrency exchange platform for buying and selling digital currencies, backed by an AI market-analysis engine.",
    technologies: ["TypeScript", "MongoDB", "Spring Boot", "Kotlin"],
    links: { demo: "#", github: "#" },
    position: [3.7, 1.7, -2],
    color: "#22d3ee", // cyan
  },
  {
    name: "Parswater",
    tagline: "Water tokenization",
    description:
      "Blockchain-based platform for water-share tokenization and trading, with decentralized transaction tracking and analytics.",
    technologies: ["Blockchain", "Smart Contracts", "React", "Node.js"],
    links: { demo: "#", github: "#" },
    position: [1.6, -3.0, -3],
    color: "#34d399", // emerald
  },
  {
    name: "Sipan",
    tagline: "Inspection & lifecycle",
    description:
      "Web and mobile application for equipment inspection and lifecycle management at NIOC, with offline support and RBAC.",
    technologies: ["React", "React Native", "Node.js", "MongoDB"],
    links: { demo: "#", github: "#" },
    position: [4.0, -1.3, -1.5],
    color: "#a78bfa", // violet
  },
]

export const experiences: Experience[] = [
  {
    company: "Esbaar",
    position: "Senior Software Developer",
    location: "Muscat, Oman",
    date: "Oct 2023 to Present",
    responsibilities: [
      "Improved system performance by 40% through code optimization",
      "Implemented WebRTC for real-time video streaming of rig activities",
      "Integrated Socket.IO for live WITS data transmission",
      "Redesigned dashboard and UI with React for improved user experience",
      "Contributed to RIG-AI deployment for PDO, enhancing safety measures",
    ],
  },
  {
    company: "Farabin",
    position: "Senior Software Developer",
    date: "May 2022 to Aug 2023",
    responsibilities: [
      "Designed and developed a web and mobile application for Equipment Inspection and Lifecycle Management for NIOC",
      "Built a user management system with role-based access control",
      "Implemented features for tracking equipment lifecycle, including usage history and maintenance",
      "Developed tools for inspection management with customizable dashboards and reports",
      "Ensured offline accessibility for uninterrupted functionality",
      "Planned advanced features like Risk-Based Inspection (RBI) and Preventive Maintenance Optimization (PMO)",
    ],
  },
  {
    company: "Biratex Co.",
    position: "CTO",
    location: "Tehran, Iran",
    date: "Apr 2021 to March 2023",
    responsibilities: [
      "Developed an advanced stock market analysis platform using Python and AI",
      "Led DevOps initiatives to optimize deployment pipelines and monitor infrastructure",
      "Implemented CI/CD pipelines using Docker and Kubernetes",
    ],
  },
  {
    company: "Parswater",
    position: "Team Lead",
    location: "Yazd, Iran",
    date: "May 2020 to March 2021",
    responsibilities: [
      "Designed and implemented a blockchain-based platform for water share tokenization",
      "Enhanced system reliability and scalability through performance optimization",
      "Delivered features like decentralized transaction tracking and detailed analytics",
    ],
  },
  {
    company: "Sandbad Co",
    position: "Mentor / Full-stack Developer",
    location: "Yazd, Iran",
    date: "Jun 2015 to Feb 2019",
    responsibilities: [
      "Mentored startup teams on software development and deployment",
      "Developed a Vue-based automated cryptocurrency trading assistant",
      "Built an administrative panel for user management and delivery tracking",
    ],
  },
  {
    company: "Pishtazan Setare Isatis",
    position: "Developer",
    location: "Yazd, Iran",
    date: "Oct 2014 to Nov 2015",
    responsibilities: [
      "Developed a web application to manage parking access and route permissions",
      "Improved parking system efficiency by enhancing security and simplifying workflows",
    ],
  },
]

export const skills: SkillCategory[] = [
  { category: "General", items: ["System Design", "Test Driven Development", "Jira", "Micro-Services"] },
  {
    category: "Programming Languages",
    items: ["Java", "Kotlin", "Python", "Rust", "TypeScript", "JavaScript", "PHP"],
  },
  {
    category: "Frameworks",
    items: ["Spring Boot", "React.js", "Next.js", "Jetpack Compose", "Laravel", "Express.js"],
  },
  { category: "Tools And DB's", items: ["Git", "Docker", "CI/CD", "PostgreSQL", "MongoDB", "Redis"] },
  {
    category: "Networking",
    items: [
      "CCNP-level expertise",
      "Network Administration",
      "Socket Programming",
      "Netty",
      "Socket.io",
      "WebRTC",
      "Video Optimization",
    ],
  },
]

export const education: Education[] = [
  {
    degree: "Master's in Computer Networks And Communications",
    institution: "University of Yazd",
    location: "Yazd, Iran",
    date: "Sep 2018 to Nov 2021",
  },
  {
    degree: "Bachelor's in Computer Software Engineering",
    institution: "University of Yazd",
    location: "Yazd, Iran",
    date: "Sep 2012 to May 2017",
  },
]

export const certifications: Certification[] = [
  {
    name: "Network+",
    label: "CompTIA Network Plus",
    url: "https://drive.google.com/file/d/1rufY3no366dEK4Qz5NE6OON3Bcq-mFAo/view?usp=drive_link",
  },
  {
    name: "CCNA",
    label: "Cisco Certified Network Associate",
    url: "https://drive.google.com/file/d/1qBbgoK3mLUIJaAtlgyDnUewcWfdKFDuN/view?usp=drive_link",
  },
  {
    name: "CCNP",
    label: "Cisco Certified Network Professional",
    url: "https://drive.google.com/file/d/1jSktgIiziWVGC61ASTeCXP8LZSv1hXsq/view?usp=drive_link",
  },
  {
    name: "MCITP",
    label: "Microsoft Certified IT Professional",
    url: "https://drive.google.com/file/d/1bSQ8I86w1pzpaKg4VNvFagzKGQKC8dbX/view?usp=drive_link",
  },
]

export const awards: AwardItem[] = [
  {
    title: "ACM",
    description: "International Collegiate Programming Contest",
    years: ["2013", "2014"],
    url: "https://icpc.global/",
  },
  { title: "JavaCup", description: "JCal Contest", url: "http://javacup.ir/jcal-second-series-ranking/" },
  {
    title: "Security Cert",
    url: "https://drive.google.com/file/d/1bmeJ-Hubz-ovqnJO4WK2s0GcQCj9-jT6/view?usp=drive_link",
  },
]

export const stats = [
  { value: "11+", label: "Years shipping" },
  { value: "6", label: "Companies led / built" },
  { value: "40%", label: "Perf gains delivered" },
  { value: "∞", label: "Coffees consumed" },
]
