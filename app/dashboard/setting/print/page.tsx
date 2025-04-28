"use client"

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOutlet } from '@/contexts/outlet-context'
import { toast } from '@/hooks/use-toast'
import { createPrintTemplate, usePrintTemplateByOutlet } from '@/services/print-template-service'
import { PrintTemplateInput } from '@/types/template-print'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { LoaderCircle, Store, Upload } from 'lucide-react'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

export default function TemplatePrintPage() {

  const { currentOutlet } = useOutlet()
  const outletId = currentOutlet?.id || 0

  const { data, refetch, isLoading } = usePrintTemplateByOutlet(currentOutlet?.id ?? 0);
  const { mutate } = createPrintTemplate()

  const initialFormData: PrintTemplateInput = {
    company_name: data?.data?.company_name ?? "",
    company_slogan: data?.data?.company_slogan ?? "",
    footer_message: data?.data?.footer_message ?? "",
    logo: undefined,
    outlet_id: currentOutlet?.id ?? 1
  }
  const [formData, setFormData] = useState<PrintTemplateInput>(initialFormData)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) {
      // setFormData(prev => ({
      //   ...prev,
      //   ...data.data,
      //   outlet_id: outletId 
      // }))

      setFormData(prev => ({
        ...prev,
        company_name: data.data?.company_name ?? "",
        company_slogan: data.data?.company_slogan ?? "",
        footer_message: data.data?.footer_message ?? "",
        outlet_id: outletId,
        logo: undefined
      }))
      setPreviewImage(data.data?.logo_url ?? null)
    }
  }, [data, outletId])



  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, logo: file }))
    } else {
      setPreviewImage(null)
      setFormData(prev => ({ ...prev, logo: null }))
    }
  }

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData()

    formDataToSend.append('company_name', formData.company_name)
    formDataToSend.append('outlet_id', `${outletId}`)
    formDataToSend.append('company_slogan', formData.company_slogan)
    formDataToSend.append('footer_message', formData.footer_message)
    if (formData.logo) {
      formDataToSend.append('logo', formData.logo)
    }

    mutate(formDataToSend, {
      onSuccess: () => {
        refetch()
        toast({
          title: "Perubahan disimpan!",
          description: "Berhasil mengupdate template nota"
        })
      },
      onError: (err) => {
        toast({
          title: "Gagal melakukan perubahan pada template!",
          description: "Terjadi kesalahan saat mencoba memperbarui template. Silahkan coba lagi"
        })
      }
    })
    console.log({ formData })
  }
  return (
    <div className="flex flex-col space-y-6 ">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Atur Template Print
        </h2>
      </div>

      {currentOutlet && (
        <Alert >
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5" />
            <div>
              <AlertTitle >
                Menampilkan template untuk: {currentOutlet.name}
              </AlertTitle>
              <AlertDescription>
                Template print yang ditampilkan khusus untuk outlet ini.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      <Card className="">
        <form onSubmit={submitHandler} encType='multipart/form-data'>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Info Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
                    Nama Perusahaan
                  </Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData?.company_name ?? ""}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama perusahaan..."
                    className="focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_slogan" className="text-sm font-medium text-gray-700">
                    Slogan Perusahaan
                  </Label>
                  <Input
                    id="company_slogan"
                    name="company_slogan"
                    value={formData?.company_slogan ?? ""}
                    onChange={handleInputChange}
                    placeholder="Masukkan slogan perusahaan..."
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
                    Logo Perusahaan
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <label
                        htmlFor="logo"
                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                      >
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview Logo"
                            className="w-full h-full rounded-lg object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="w-6 h-6 text-gray-400 mb-2 mx-auto" />
                            <span className="text-xs text-gray-500">Upload Logo</span>
                          </div>
                        )}
                      </label>
                      <Input
                        type="file"
                        id="logo"
                        accept="image/*"
                        name="logo"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      Format: PNG/JPG (Maks. 10MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Message */}
            <div className="space-y-2">
              <Label htmlFor="footer_message" className="text-sm font-medium text-gray-700">
                Pesan Footer
              </Label>
              <Input
                id="footer_message"
                name="footer_message"
                value={formData?.footer_message ?? ""}
                onChange={handleInputChange}
                placeholder="Masukkan pesan footer..."
              />
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex gap-3 justify-end w-full">
              {/* <Button>Preview</Button> */}
              <Button
                type="reset"
                variant="outline"
                className="text-destructive hover:bg-red-50 hover:text-destructive-700"
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button type='submit' disabled={isLoading}>
                Simpan
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
