import { Outlet } from "./outlet";
import { StatusMessage } from "./response";

export interface PrinteTemplateResponse extends StatusMessage {
  data?: PrintTemplate
}

export interface PrintTemplate {
  id: number
  company_name: string
  outlet_id: number
  company_slogan: string
  footer_message: string,
  logo: File | undefined | null,
  created_at: Date,
  logo_url: string
  updated_at: Date,
  outlet: Outlet
}

export interface PrintTemplateInput extends Omit<PrintTemplate, "id" | "created_at" | "updated_at" | "outlet" | "logo_url"> { }