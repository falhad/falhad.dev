import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Briefcase, Building2, Calendar, CheckCircle2, MapPin} from "lucide-react"

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
        <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
                        <Briefcase className="h-5 w-5 text-fuchsia-400" aria-hidden />
                    </div>
                    <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                        What I have done?
                    </CardTitle>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" aria-hidden/>
                    {experiences.map((exp, index) => (
                        <div key={index} className="relative mb-6 last:mb-0 pl-8">
                            {/* Timeline dot */}
                            <span
                                className="absolute left-0 top-2 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400 shadow-sm"
                                aria-hidden
                            >
                <span className="h-1.5 w-1.5 rounded-full bg-background"/>
              </span>

                            {/* Position */}
                            <div className="flex items-start gap-2">
                                <Briefcase className="mt-0.5 h-5 w-5 text-primary/80"/>
                                <h3 className="text-lg font-semibold text-primary leading-tight">{exp.position}</h3>
                            </div>

                            {/* Company */}
                            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-4 w-4"/>
                                <span>{exp.company}</span>
                            </div>

                            {/* Location (optional) */}
                            {exp.location && (
                                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4"/>
                                    <span>{exp.location}</span>
                                </div>
                            )}

                            {/* Date */}
                            <Badge variant="secondary" className="mt-2 inline-flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5"/>
                                <span>{exp.date}</span>
                            </Badge>

                            {/* Responsibilities */}
                            <ul className="mt-2 space-y-1.5 text-muted-foreground">
                                {exp.responsibilities.map((resp, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-fuchsia-400"/>
                                        <span>{resp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

