"use client"

import type React from "react"
import { useSearchParams } from "next/navigation"
import ProductsContent from "@/components/products/products-content"
import CategoriesContent from "@/components/products/categories-content"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "list"

 


  return (
    <div className="flex flex-col space-y-4">
      {tab === 'list' && <ProductsContent />}
      {tab === 'categories' && <CategoriesContent />}
    </div>
  )
}

