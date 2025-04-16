import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

interface TopProduct {
  name: string
  quantity: string
  total: string
}

interface RecentSalesProps {
  products: TopProduct[]
}

export function RecentSales({ products = [] }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {products.map((product) => (
        <div key={product.name} className="flex items-center">
          {/* <Avatar className="h-9 w-9">
            <AvatarFallback>{product.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar> */}
          
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
          </div>
          <div className="ml-auto font-medium">Rp {parseInt(product.total).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}