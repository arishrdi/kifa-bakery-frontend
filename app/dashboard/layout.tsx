"use client";

import type React from "react";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { OutletProvider } from "@/contexts/outlet-context";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OutletProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <SidebarNav />
          <SidebarInset>
            <div className="flex flex-col min-h-screen">
              <header className="flex h-16 items-center border-b px-4">
                <SidebarTrigger className="mr-4" />
                <div className="ml-auto flex items-center space-x-4">
                  <ModeToggle />
                  <UserNav />
                </div>
              </header>
              <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full bg-primary-foreground dark:bg-gray-900">
                {children}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </OutletProvider>
  );
}
