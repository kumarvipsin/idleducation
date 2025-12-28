"use client";

import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  School,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/cbse",
    label: "CBSE Classes",
    icon: BookOpen,
  },
  {
    href: "/gov-exams",
    label: "Govt. Exams",
    icon: ShieldCheck,
  },
  {
    href: "/nios",
    label: "NIOS Board",
    icon: School,
  },
  {
    href: "/study-plan",
    label: "AI Study Plan",
    icon: WandSparkles,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex w-full items-center gap-2.5 p-2 pr-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 outline-none ring-sidebar-ring focus-visible:ring-2"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <span className="font-headline text-lg font-semibold text-foreground">
              EduVerse
            </span>
          </Link>
          <div className="flex-1" />
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
