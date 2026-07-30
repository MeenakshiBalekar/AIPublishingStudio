import { z } from "zod";
import { splitList } from "@/lib/utils/json";

/** Content Project form (workflow Step 1: metadata). */
export const projectFormSchema = z.object({
  brandId: z.string().min(1, "Select a brand"),
  contentType: z.string().min(1, "Select a content type"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().default(""),
  topic: z.string().optional().default(""),
  ageGroup: z.string().optional().default(""),
  description: z.string().optional().default(""),
  keywords: z.string().optional().default(""),
  language: z.string().optional().default("English"),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function projectFormToDbData(values: ProjectFormValues) {
  return {
    brandId: values.brandId,
    contentType: values.contentType,
    title: values.title.trim(),
    subtitle: values.subtitle || null,
    topic: values.topic || null,
    ageGroup: values.ageGroup || null,
    description: values.description || null,
    keywords: (() => {
      const arr = splitList(values.keywords);
      return arr.length ? JSON.stringify(arr) : null;
    })(),
    language: values.language || "English",
  };
}
