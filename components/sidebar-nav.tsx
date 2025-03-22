"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Home,
  Package,
  CreditCard,
  Clock,
  LockKeyhole,
  FileBarChart,
  Store,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  History,
  Calendar,
  ArrowLeftRight,
  Users,
  Map,
  LineChart,
  BarChart,
  ClipboardList,
  Cake,
  Filter,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { OutletSwitcher } from "./outlet-switcher"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    subItems: [
      { name: "Overview", href: "/dashboard?tab=overview", icon: LayoutDashboard },
      { name: "Stok", href: "/dashboard?tab=stock", icon: Package },
      { name: "Shift", href: "/dashboard?tab=shifts", icon: Clock },
    ],
  },
  {
    name: "Produk",
    href: "/dashboard/products",
    icon: Cake,
    subItems: [
      { name: "Daftar Produk", href: "/dashboard/products?tab=list", icon: ClipboardList },
      { name: "Kategori", href: "/dashboard/products?tab=categories", icon: Filter },
    ],
  },
  {
    name: "Outlet",
    href: "/dashboard/outlets",
    icon: Store,
    subItems: [
      { name: "Daftar Outlet", href: "/dashboard/outlets?tab=list", icon: ClipboardList },
      { name: "Peta Outlet", href: "/dashboard/outlets?tab=map", icon: Map },
      { name: "Performa Outlet", href: "/dashboard/outlets?tab=performance", icon: BarChart },
    ],
  },
  {
    name: "Stok",
    href: "/dashboard/stock",
    icon: Package,
    subItems: [
      { name: "Stok Realtime", href: "/dashboard/stock?tab=realtime", icon: Package },
      { name: "Riwayat Stok", href: "/dashboard/stock?tab=history", icon: History },
      { name: "Stok Per Tanggal", href: "/dashboard/stock?tab=custom", icon: Calendar },
      { name: "Transfer Stok", href: "/dashboard/stock?tab=transfer", icon: ArrowLeftRight },
    ],
  },
  {
    name: "POS",
    href: "/dashboard/pos",
    icon: CreditCard,
    subItems: [],
  },
  {
    name: "Shift",
    href: "/dashboard/shifts",
    icon: Clock,
    subItems: [
      { name: "Jadwal Shift", href: "/dashboard/shifts?tab=shifts", icon: Clock },
      { name: "Staff", href: "/dashboard/shifts?tab=staff", icon: Users },
    ],
  },
  {
    name: "Closing",
    href: "/dashboard/closing",
    icon: LockKeyhole,
    subItems: [
      { name: "Hari Ini", href: "/dashboard/closing?tab=today", icon: Calendar },
      { name: "Riwayat Closing", href: "/dashboard/closing?tab=history", icon: History },
    ],
  },
  {
    name: "Laporan",
    href: "/dashboard/reports",
    icon: FileBarChart,
    subItems: [
      { name: "Overview", href: "/dashboard/reports?tab=overview", icon: LayoutDashboard },
      { name: "Penjualan", href: "/dashboard/reports?tab=sales", icon: LineChart },
      { name: "Stok", href: "/dashboard/reports?tab=stock", icon: Package },
      { name: "Laporan Bulanan", href: "/dashboard/reports?tab=monthly", icon: FileBarChart },
      { name: "Perbandingan Outlet", href: "/dashboard/reports?tab=outlets", icon: BarChart },
    ],
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (name: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  // Check if a path is active (exact match or starts with path for submenus)
  const isActive = (href: string) => {
    const baseHref = href.split("?")[0]
    const basePathname = pathname.split("?")[0]

    // Check if this is the exact path or if it's a parent path
    return basePathname === baseHref || (baseHref !== "/dashboard" && basePathname.startsWith(baseHref))
  }

  // Check if a submenu item is active (includes the tab parameter)
  // const isSubItemActive = (href: string) => {
  //   if (href.includes("?")) {
  //     const [path, query] = href.split("?")
  //     const basePathname = pathname.split("?")[0]

  //     // If we're on the exact path
  //     if (path === basePathname) {
  //       // Check if the URL has the same tab parameter
  //       const currentParams = new URLSearchParams(searchParams?.toString() || "")
  //       const hrefParams = new URLSearchParams(query)
  //       const currentTab = currentParams.get("tab")
  //       const hrefTab = hrefParams.get("tab")

  //       // If there's no tab in the URL but this is the base path, it's active
  //       if (!currentTab && path === basePathname) {
  //         return !hrefTab || hrefTab === "overview"
  //       }

  //       return currentTab === hrefTab
  //     }
  //   }
  //   return href === pathname
  // }

  const isSubItemActive = (href: string) => {
    const [path, query] = href.split("?")
    const basePathname = pathname.split("?")[0]
    
    // Pertama pastikan path utama cocok
    if (basePathname !== path) return false
    
    // Handle kasus untuk dashboard utama
    const currentTab = searchParams?.get("tab")
    const hrefTab = new URLSearchParams(query).get("tab")
  
    // Jika tidak ada tab di URL, anggap sebagai 'overview'
    if (path === "/dashboard" && !currentTab) {
      return hrefTab === "overview"
    }
  
    return currentTab === hrefTab
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">Kifa Bakery</h1>
        </div>
        <div className="mt-4">
          <OutletSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              {item.subItems.length > 0 ? (
               <Collapsible
               open={
                 openSections[item.name] ||
                 item.subItems.some((subItem) => isSubItemActive(subItem.href)) // Perubahan disini
               }
               className="w-full"
             >
                  <CollapsibleTrigger asChild onClick={() => toggleSection(item.name)}>
                    <SidebarMenuButton className="justify-between" isActive={isActive(item.href)} tooltip={item.name}>
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                      </div>
                      {openSections[item.name] || isActive(item.href) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton asChild isActive={isSubItemActive(subItem.href)}>
                            <Link href={subItem.href} className="flex items-center">
                              <subItem.icon className="h-4 w-4 mr-2" />
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.name}>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

