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
  Truck,
  UserRound,
  BookUser,
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
import Image from "next/image"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    subItems: []
    // subItems: [
    //   { name: "Overview", href: "/dashboard?tab=overview", icon: LayoutDashboard },
    //   { name: "Stok", href: "/dashboard?tab=stock", icon: Package },
    //   { name: "Shift", href: "/dashboard?tab=shifts", icon: Clock },
    // ],
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
      // { name: "Peta Outlet", href: "/dashboard/outlets?tab=map", icon: Map },
      // { name: "Performa Outlet", href: "/dashboard/outlets?tab=performance", icon: BarChart },
    ],
  },
  {
    name: "Stok",
    href: "/dashboard/stock",
    icon: Package,
    subItems: [
      // { name: "Atur Stok", href: "/dashboard/stock?tab=adjustment", icon: Package },
      // { name: "Stok Realtime", href: "/dashboard/stock?tab=realtime", icon: Package },
      { name: "Penyesuaian Stok", href: "/dashboard/stock?tab=adjustment", icon: Package },
      { name: "Riwayat Stok", href: "/dashboard/stock?tab=history", icon: History },
      { name: "Stok Per Tanggal", href: "/dashboard/stock?tab=custom", icon: Calendar },
      { name: "Transfer Stok", href: "/dashboard/stock?tab=transfer", icon: Truck },
      { name: "Approve Stok", href: "/dashboard/stock?tab=approve", icon: ArrowLeftRight },
    ],
  },
  // {
  //   name: "POS",
  //   href: "/pos",
  //   icon: CreditCard,
  //   subItems: [],
  // },
  {
    name: "User",
    href: "/dashboard/u/",
    icon: Users,
    subItems: [
      {
        name: "Staff",
        href: "/dashboard/u/staff",
        icon: UserRound
      },
      {
        name: "Member",
        href: "/dashboard/u/member",
        icon: BookUser
      }
    ],
  },
  {
    name: "Closing",
    href: "/dashboard/closing",
    icon: LockKeyhole,
    subItems: [
      // { name: "Hari Ini", href: "/dashboard/closing?tab=today", icon: Calendar },
      { name: "Riwayat Kas", href: "/dashboard/closing?tab=history", icon: History },
      { name: "Riwayat Transaksi", href: "/dashboard/closing?tab=history-order", icon: History },
    ],
  },
  {
    name: "Laporan",
    href: "/dashboard/reports",
    icon: FileBarChart,
    subItems: [
      { name: "Perhari", href: "/dashboard/reports?tab=dailySales", icon: LineChart },
      { name: "Per Item", href: "/dashboard/reports?tab=monthly", icon: FileBarChart },
      { name: "Per Kategori", href: "/dashboard/reports?tab=kategori", icon: BarChart },
      { name: "Per Member", href: "/dashboard/reports?tab=productByMember", icon: UserRound },
      { name: "Stok", href: "/dashboard/reports?tab=stock", icon: Package },
      { name: "Stok Realtime", href: "/dashboard/reports?tab=realtime", icon: Package },
      { name: "Approve", href: "/dashboard/reports?tab=approve", icon: ArrowLeftRight },
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

  const isActive = (href: string) => {
    const baseHref = href.split("?")[0]
    const basePathname = pathname.split("?")[0]

    return basePathname === baseHref || (baseHref !== "/dashboard" && basePathname.startsWith(baseHref))
  }


  const isSubItemActive = (href: string) => {
    const [path, query] = href.split("?")
    const basePathname = pathname.split("?")[0]

    if (basePathname !== path) return false

    const currentTab = searchParams?.get("tab")
    const hrefTab = new URLSearchParams(query).get("tab")

    if (path === "/dashboard" && !currentTab) {
      return hrefTab === "overview"
    }

    return currentTab === hrefTab
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4 ">
        <div className="flex items-center">
          {/* <BarChart3 className="h-6 w-6 mr-2" /> */}
          <Image src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0JeOFanmAshWgLBlxIH5qHVyx7okwwmeV9Wbqr9n8Aie9Gh-BqnAF0_PlfBa_ZHqnENEOz8MuPZxFYFfgvCAYF8ie3AMRW_syA0dluwZJW-jg7ZuS8aaRJ38NI2f7UFW1ePVO4kifJTbdZi0WvQFr77GyqssJzeWL2K65GPB4dZwHEkZnlab9qNKX9VSZ/s320/logo-kifa.png" alt="Logo kifa" width={200} height={200} className="w-12 mr-4" />
          <h1 className="text-xl font-bold">Kifa Bakery</h1>
        </div>
        <div className="mt-4">
          <OutletSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 ">
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

