import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const stockData = [
  {
    id: 1,
    name: "Produk A",
    category: "Kategori 1",
    currentStock: 25,
    minStock: 10,
    status: "normal",
  },
  {
    id: 2,
    name: "Produk B",
    category: "Kategori 2",
    currentStock: 8,
    minStock: 10,
    status: "low",
  },
  {
    id: 3,
    name: "Produk C",
    category: "Kategori 1",
    currentStock: 0,
    minStock: 5,
    status: "out",
  },
  {
    id: 4,
    name: "Produk D",
    category: "Kategori 3",
    currentStock: 42,
    minStock: 15,
    status: "normal",
  },
  {
    id: 5,
    name: "Produk E",
    category: "Kategori 2",
    currentStock: 3,
    minStock: 10,
    status: "low",
  },
]

export function StockStatus() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Produk</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead className="text-right">Stok Saat Ini</TableHead>
          <TableHead className="text-right">Min. Stok</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stockData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="text-right">{item.currentStock}</TableCell>
            <TableCell className="text-right">{item.minStock}</TableCell>
            <TableCell>
              {item.status === "normal" && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Normal
                </Badge>
              )}
              {item.status === "low" && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                >
                  Stok Rendah
                </Badge>
              )}
              {item.status === "out" && (
                <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                  Habis
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

