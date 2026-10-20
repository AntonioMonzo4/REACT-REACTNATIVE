import { z } from 'zod'

export const esquemaPost = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(80, 'El título no puede superar los 80 caracteres'),
  body: z
    .string()
    .trim()
    .min(10, 'El contenido debe tener al menos 10 caracteres')
    .max(500, 'El contenido no puede superar los 500 caracteres'),
})

export type DatosPost = z.infer<typeof esquemaPost>
