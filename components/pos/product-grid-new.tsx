"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  image: string
}

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
    const matchesCategory = activeCategory === "Semua" || product.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredProducts.map((product) => (
        <Card
          key={product.id}
          className={`overflow-hidden transition-all border-orange-200 hover:border-orange-400 hover:shadow-md ${product.stock === 0 ? "opacity-60" : ""}`}
        >
          <div className="aspect-square relative bg-orange-50">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover p-2" />
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
                Stok: {product.stock}
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">Habis</span>
              </div>
            )}
          </div>
          <CardContent className="p-3">
            <div className="mb-2">
              <h3 className="font-medium truncate">{product.name}</h3>
              <p className="text-sm text-orange-600 font-bold">Rp {product.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Stok: {product.stock}</p>
            </div>
            <Button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="w-full mt-1 bg-orange-500 hover:bg-orange-600 text-sm h-8"
            >
              {product.stock === 0 ? "Stok Habis" : "+ Tambahkan"}
            </Button>
          </CardContent>
        </Card>
      ))}

      {filteredProducts.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center h-60 border border-dashed rounded-lg border-orange-200">
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

