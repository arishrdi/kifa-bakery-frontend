"use client"

import { getAllOutlets } from "@/services/outlet-service"
import { Outlet } from "@/types/outlet"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// export interface Outlet {
//   id: number
//   name: string
//   address: string
//   phone: string
//   manager: string
//   isActive: boolean
// }

interface OutletContextType {
  outlets: Outlet[]
  currentOutlet: Outlet | null
  setCurrentOutlet: (outlet: Outlet) => void
  isLoading: boolean
}

// Sample data for outlets
// const sampleOutlets: Outlet[] = [
//   {
//     id: 1,
//     name: "Outlet Pusat",
//     address: "Jl. Utama No. 123, Jakarta",
//     phone: "021-5551234",
//     manager: "Ahmad Sulaiman",
//     isActive: true,
//   },
//   {
//     id: 2,
//     name: "Outlet Cabang Selatan",
//     address: "Jl. Selatan No. 45, Jakarta",
//     phone: "021-5552345",
//     manager: "Budi Santoso",
//     isActive: true,
//   },
//   {
//     id: 3,
//     name: "Outlet Cabang Timur",
//     address: "Jl. Timur No. 67, Jakarta",
//     phone: "021-5553456",
//     manager: "Cindy Wijaya",
//     isActive: true,
//   },
// ]

const OutletContext = createContext<OutletContextType>({
  outlets: [],
  currentOutlet: null,
  setCurrentOutlet: () => { },
  isLoading: true,
})

export function OutletProvider({ children }: { children: React.ReactNode }) {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [currentOutlet, setCurrentOutlet] = useState<Outlet | null>(null)

  const { data, isLoading } = getAllOutlets()
  useEffect(() => {
    if (data) {
      setOutlets(data.data)

      if (!currentOutlet && data.data.length > 0) {
        setCurrentOutlet(data.data[0])
      }
    }

  }, [data, outlets])

  const value = {
    outlets,
    currentOutlet,
    setCurrentOutlet,
    isLoading,
  }

  return <OutletContext.Provider value={value}>{children}</OutletContext.Provider>
}

export function useOutlet() {
  const context = useContext(OutletContext)
  if (!context) {
    throw new Error("useOutlet must be used within an OutletProvider")
  }
  return context
}

