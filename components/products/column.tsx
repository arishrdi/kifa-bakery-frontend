import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/types/product"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

// export type Payment = {
//   id: number
//   name: string
//   sku: string
//   price: string
//   category: {
//     name: string
//   }
//   quantity: number
//   is_active: boolean
//   min_stock: number
// }

export const columns: ColumnDef<Product>[] = [
  {
    id: "no",
    header: "No.",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.index + 1}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Nama Produk",
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-orange-100 flex items-center justify-center">
          <img
            src={row.original.image_url}
            alt="gambar product"
            className="h-10 w-10 rounded-md object-cover"
          />
        </div>
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
            {row.original.description || '-'}
          </div>
        </div>
      </div>
    )
  },
  {
    accessorKey: "sku",
    header: "SKU",
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "category.name",
    header: "Kategori",
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price)
    },
  },
  {
    accessorKey: "quantity",
    header: "Stok",
    cell: ({ row }) => (
      <div className="text-right">
        {row.getValue("quantity")}
        <div className="text-xs text-muted-foreground">
          Min. stok: {row.original.min_stock}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("is_active") ? "default" : "destructive"}>
        {row.getValue("is_active") ? "Active" : "Inactive"}
      </Badge>
    ),
  },

  {
    id: "actions",
    cell: ({ row, table }) => {
      const payment = row.original

      const { onEdit, onDelete } = table.options.meta as {
        onEdit: (data: Product) => void
        onDelete: (data: Product) => void
      }

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(payment)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(payment)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]