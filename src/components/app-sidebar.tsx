import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, ShieldCheck } from "lucide-react";

import { NAV_ITEMS } from "@/lib/tools";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold">Aperture AI</p>
              <p className="truncate text-xs text-muted-foreground">Workplace assistant</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.to}
                    tooltip={item.title}
                    data-testid={`nav-${item.to === "/" ? "dashboard" : item.to.slice(1)}`}
                  >
                    <Link to={item.to} onClick={() => isMobile && setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              <ShieldCheck className="size-3.5 text-primary" /> Responsible AI
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              AI output can be wrong. Review before sending or sharing.
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <ShieldCheck className="size-4 text-primary" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
