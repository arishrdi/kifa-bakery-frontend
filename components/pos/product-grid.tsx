"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/product"
import { ShoppingCart } from "lucide-react"

interface ProductGridProps {
  products: Product[]
  searchQuery: string
  activeCategory: string
  addToCart: (product: Product) => void
}

export function ProductGrid({ products, searchQuery, activeCategory, addToCart }: ProductGridProps) {
  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "Semua" || product.category.name === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-3">
      {filteredProducts.map((product) => (
        <Card
        onClick={() => addToCart(product)}
        key={product.id}
        className={`flex flex-row items-center justify-between overflow-hidden transition-all border-orange-200 hover:border-orange-400 hover:shadow-md p-2 ${product.quantity === 0 ? "opacity-60" : ""}`}
      >
        <CardContent className="p-0 flex-1">
          <div className="flex flex-row items-center justify-between w-full">
            {/* Informasi Produk */}
            <div className="flex flex-col space-y-0.5">
              <h3 className="text-sm font-medium line-clamp-1">
                {product.name} ({product.quantity})
              </h3>
              <p className="text-xs text-orange-600 font-semibold">
                Rp {product.price.toLocaleString()}
              </p>
              {product.quantity <= product.min_stock && product.quantity > 0 && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-1 py-0.5 rounded">
                  Produk menipis
                </span>
              )}
            </div>
      
            {/* Informasi Kategori & Tombol */}
            <div className="flex flex-col items-end space-y-1">
              <div className="flex items-center space-x-1">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span className="text-xs">{product.category.name}</span>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={product.quantity === 0}
                className="bg-orange-500 hover:bg-orange-600 text-xs h-6 px-2 rounded-md"
              >
                {product.quantity === 0 ? "Tidak Tersedia" : "Tambah"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      ))}

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 border border-dashed rounded-lg border-orange-200">
          <div className="text-orange-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <p className="text-muted-foreground text-center mx-2">
            Tidak ada produk yang ditemukan. Coba cari dengan kata kunci lain.
          </p>
        </div>
      )}
    </div>
  )
}