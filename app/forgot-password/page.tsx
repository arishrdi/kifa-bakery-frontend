"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simple validation
      if (!email) {
        throw new Error("Email harus diisi")
      }

      // For demo purposes, accept any email
      // In a real app, you would send a reset email through your backend

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Kifa Bakery</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sistem Manajemen Bisnis Terintegrasi</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {isSubmitted
                ? "Instruksi reset password telah dikirim ke email Anda"
                : "Masukkan email Anda untuk menerima instruksi reset password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Mail className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Kami telah mengirimkan instruksi reset password ke email Anda. Silakan periksa kotak masuk Anda dan
                  ikuti petunjuk yang diberikan.
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">Kembali ke Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@perusahaan.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Kirim Instruksi Reset"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <Link href="/login" className="flex items-center text-sm text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke halaman login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

