import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experiences = [
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
    location: "",
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
];

export default function Experience() {
  return (
    <Card className="mb-8 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">Professional Experience</CardTitle>
      </CardHeader>
      <CardContent>
        {experiences.map((exp, index) => (
          <div key={index} className="mb-6 last:mb-0 border-l-2 border-blue-500 pl-4 py-2">
            <h3 className="text-xl font-semibold text-blue-300">{exp.position}</h3>
            <p className="text-gray-400">
              {exp.company} | {exp.location}
            </p>
            <Badge variant="secondary" className="mt-1 mb-2">
              {exp.date}
            </Badge>
            <ul className="list-disc pl-5 text-gray-300">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx} className="mb-1">
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

