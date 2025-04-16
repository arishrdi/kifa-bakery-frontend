import React, { ChangeEvent, FormEvent, SetStateAction, useState } from 'react'
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Loader, Loader2, Plus } from 'lucide-react';
import { Product } from '@/types/product';
import { InventoryInput } from '@/types/inventory';
import { useAuth } from '@/contexts/auth-context';
import { createInventoryCashier } from '@/services/inventory-service';
import { toast } from '@/hooks/use-toast';

type FormAdjustStockProps = {
    setIsAdjustStockDialogOpen: (value: SetStateAction<boolean>) => void
    products: Product[]
    refetch: any
}

export default function FormAdjustStock({ setIsAdjustStockDialogOpen, products, refetch }: FormAdjustStockProps) {

    const { user } = useAuth()

    const createInventory = createInventoryCashier()

    const initialInventoryFormData: InventoryInput = {
        outlet_id: user?.outlet_id ?? 0,
        product_id: "",
        quantity_change: "",
        type: "",
        notes: ""
    }
    const [inventoryFormData, setInventoryFormData] = useState<InventoryInput>(initialInventoryFormData)

    const handleNumericInput = (name: any, value: string) => {
        const cleanedValue = value.replace(/[^-0-9]/g, '');

        if (cleanedValue === '-' || cleanedValue === '') {
            return '';
        }

        const processedValue = cleanedValue.startsWith('-')
            ? '-' + cleanedValue.replace(/-/g, '')
            : cleanedValue;

        return parseInt(processedValue, 10).toString();
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'price' || name === 'quantity' || name === 'min_stock' || name === 'quantity_change') {


            setInventoryFormData(prev => ({
                ...prev,
                [name]: handleNumericInput(name, value)
            }));
        } else {

            setInventoryFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const handleAdjustStockSubmit = (e: FormEvent) => {
        e.preventDefault()

        createInventory.mutate(inventoryFormData, {
            onSuccess: () => {
                refetch()
                toast({ title: "Berhasil mengatur stok!", description: "Perubahan membutuhkan persetujuan admin" })
            },
            onError: () => {
                toast({ title: "Gagal mengatur stok!", description: "Tidak dapat mengatur stok, silahkan coba lagi", variant: "destructive" })
            }
        })

        // console.log({ inventoryFormData })
    }

    return (
        <form onSubmit={handleAdjustStockSubmit}>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-2 col-span-2">
                            <Label>Nama Produk</Label>
                            <Select
                                value={`${inventoryFormData.product_id}`}
                                onValueChange={(value) => setInventoryFormData(prev => ({ ...prev, product_id: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih produk" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={`${product.id}`}>{product.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Nilai + / -</Label>
                            <Input
                                type="number"
                                name="quantity_change"
                                value={inventoryFormData.quantity_change}
                                onChange={handleInputChange}
                                placeholder="Masukkan nilai penambahan/pengurangan"
                                onKeyPress={(e) => {
                                    // Izinkan tanda minus hanya di awal atau untuk bilangan negatif
                                    if (e.key === '-' && e.currentTarget.value.includes('-')) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tipe</Label>
                            <Select
                                value={inventoryFormData.type}
                                onValueChange={(value) => setInventoryFormData(prev => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="purchase">Pembelian</SelectItem>
                                    <SelectItem value="adjustment">Penyesuaian</SelectItem>
                                    <SelectItem value="shipment">Kiriman Pabrik</SelectItem>
                                    <SelectItem value="other">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>Keterangan</Label>
                            <Textarea
                                name="notes"
                                value={inventoryFormData.notes}
                                onChange={handleInputChange}
                                placeholder="Masukkan keterangan (opsional)"
                            />
                        </div>
                    </div>
                </div>

            </div>
            <DialogFooter className="border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAdjustStockDialogOpen(false)}
                >
                    Batal
                </Button>
                <Button type="submit" className="gap-2 bg-orange-600 hover:bg-orange-700" disabled={createInventory.isPending}>
                    {createInventory.isPending ? <Loader2 className='animate-spin h-4 w-4' /> : <Plus className="h-4 w-4" />}
                    Sesuaikan Stok
                </Button>
            </DialogFooter>
        </form>
    )
}
