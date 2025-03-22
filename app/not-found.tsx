// app/not-found.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-9xl font-bold text-primary">404</h1>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
            <p className="text-muted-foreground">
              Maaf, halaman yang Anda cari tidak dapat ditemukan
            </p>
          </div>

          <Button asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}

// Optional: Untuk custom metadata halaman 404
export const metadata = {
  title: "404 - Halaman Tidak Ditemukan",
  description: "Halaman yang Anda cari tidak ditemukan",
}