import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { PrinteTemplateResponse, PrintTemplateInput } from "@/types/template-print";

export const createPrintTemplate = createMutationHook<PrintTemplateInput, PrinteTemplateResponse>('/print-template', 'post');

export const usePrintTemplateByOutlet = (id: number) => {
    return createQueryHook<PrinteTemplateResponse>(`/print-template/${id}`, ['print', id.toString()])();
};

// export const usePrintTemplateByOutlet = (id: number) => {
//     return createQueryHook<PrinteTemplateResponse>(
//       `/print-template/${id}`,
//       ['print', id.toString()],
//       {
//         enabled: id > 0
//       }
//     )();
//   };