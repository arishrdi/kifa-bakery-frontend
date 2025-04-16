"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, PackagePlus, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { FormEvent, useState } from "react"
import { Product } from "@/types/product"
import FormAdjustStock from "./form-adjust-stock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import HistoryAdjustStock from "./history-adjust-stock"
import { getInventoryHistoriesCashier } from "@/services/inventory-service"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"

// import { Product } from "@/types/pos"

type AdjustStockProps = {
    products: Product[]
}

export default function AdjustStock({ products }: AdjustStockProps) {

    const [isAdjustStockDialogOpen, setIsAdjustStockDialogOpen] = useState(false)
    const [date, setDate] = useState<Date>(new Date())

    const { user } = useAuth()

    // const inventoryHistory
    const { data: inventories, refetch: refetchInventory } = getInventoryHistoriesCashier(user?.outlet_id ?? 0, format(date, 'yyyy-MM-dd'))

    return (
        <Dialog open={isAdjustStockDialogOpen} onOpenChange={setIsAdjustStockDialogOpen}>
            <DialogTrigger asChild>

                <Button variant="outline" className="border-orange-200 bg-orange-50 hover:bg-orange-100"><Package className="h-4 w-4 text-orange-500" />Stok</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Sesuaikan Stok</DialogTitle>
                    <DialogDescription>
                        Sesuaikan stok produk. Perubahan memerlukan persetujuan admin
                    </DialogDescription>
                </DialogHeader>
                <Tabs>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="form">Sesuaikan</TabsTrigger>
                        <TabsTrigger value="history">Riwayat</TabsTrigger>
                    </TabsList>
                    <TabsContent value="form" className="border-orange-200">
                        <FormAdjustStock products={products} setIsAdjustStockDialogOpen={setIsAdjustStockDialogOpen} refetch={refetchInventory} />
                    </TabsContent>
                    <TabsContent value="history">
                        {
                            inventories?.data ? <HistoryAdjustStock inventories={inventories?.data} date={date} setDate={setDate} /> : <p>Tidak ada history stok</p>
                        }

                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
