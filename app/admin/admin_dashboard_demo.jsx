"use client";

// NOTE:
// This version removes ALL external icon/chart dependencies (lucide-react, recharts)
// to avoid the runtime error: "Cannot read properties of null (reading '_')".
// It uses only React, Next.js, Tailwind, and shadcn/ui components.

import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// --------------------
// Mock Data (SAFE)
// --------------------
const projectStatusData = [
  { name: "Running", value: 12, color: "#22c55e" },
  { name: "Completed", value: 8, color: "#3b82f6" },
  { name: "Pending", value: 4, color: "#facc15" },
];

const runningProjects = [
  { id: 1, name: "Project Alpha", status: "Running" },
  { id: 2, name: "Project Beta", status: "Running" },
  { id: 3, name: "Project Gamma", status: "Running" },
];

const completedProjects = [
  { id: 4, name: "Project Delta", status: "Completed" },
  { id: 5, name: "Project Omega", status: "Completed" },
  { id: 6, name: "Project Sigma", status: "Completed" },
];

// --------------------
// Simple CSS Pie Chart
// --------------------
function SimplePieChart() {
  const total = projectStatusData.reduce((sum, i) => sum + i.value, 0);
  let cumulative = 0;

  const gradient = projectStatusData
    .map((item) => {
      const start = (cumulative / total) * 100;
      cumulative += item.value;
      const end = (cumulative / total) * 100;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div
      className="h-40 w-40 rounded-full shrink-0"
      style={{ background: `conic-gradient(${gradient})` }}
    />
  );
}

function PieLegend() {
  return (
    <ul className="space-y-2 text-sm">
      {projectStatusData.map((item) => (
        <li key={item.name} className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-gray-300">
            {item.name} ({item.value})
          </span>
        </li>
      ))}
    </ul>
  );
}

// --------------------
// Dashboard Page
// --------------------
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Button>Add New Project</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Projects" value={24} />
        <StatCard title="Running Projects" value={12} />
        <StatCard title="Completed Projects" value={8} />
      </div>

      {/* Analytics & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="bg-gray-900">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Project Status</h2>
            <div className="flex items-center gap-6">
              <SimplePieChart />
              <PieLegend />
            </div>
          </CardContent>
        </Card>

        {/* Running Projects */}
        <ProjectAccordion
          title="Running Projects"
          value="running"
          projects={runningProjects}
          badgeClass="bg-green-600"
        />

        {/* Completed Projects */}
        <ProjectAccordion
          title="Completed Projects"
          value="completed"
          projects={completedProjects}
          badgeVariant="secondary"
        />
      </div>
    </div>
  );
}

// --------------------
// Reusable Components
// --------------------
function StatCard({ title: string, value : number }) {
  return (
    <Card className="bg-gray-900">
      <CardContent className="p-6">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function ProjectAccordion({
  title : string,
  value : string,
  projects : [{id:number, name : string, status : string}],
  badgeClass : string,
  badgeVariant : string,
}) {
  return (
    <Card className="bg-gray-900">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value={value}>
            <AccordionTrigger>View {title}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                  >
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="hover:underline"
                    >
                      {project.name}
                    </Link>
                    <Badge className={badgeClass} variant={badgeVariant}>
                      {project.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
