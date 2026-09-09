import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  to: string;
  icon: LucideIcon;
  blurb: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    blurb: "Your workspace at a glance",
  },
  {
    title: "Smart Email Generator",
    to: "/email",
    icon: Mail,
    blurb: "Draft polished emails in seconds",
  },
  {
    title: "Meeting Notes Summarizer",
    to: "/meetings",
    icon: FileText,
    blurb: "Turn raw notes into decisions and actions",
  },
  {
    title: "AI Task Planner",
    to: "/tasks",
    icon: ListChecks,
    blurb: "Break a goal into an ordered plan",
  },
  {
    title: "AI Research Assistant",
    to: "/research",
    icon: Search,
    blurb: "Structured briefs on any question",
  },
  {
    title: "AI Chat",
    to: "/chat",
    icon: MessagesSquare,
    blurb: "Multi-turn assistant with memory",
  },
];
