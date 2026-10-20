import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCrearPost } from '../hooks/usePosts'
import { esquemaPost, type DatosPost } from '../schemas/post'

export function FormularioPost() {
  const crear = useCrearPost()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DatosPost>({
    resolver: zodResolver(esquemaPost),
    defaultValues: { title: '', body: '' },
  })

  const alEnviar = handleSubmit((datos) => {
    crear.mutate(datos, {
      onSuccess: () => reset(),
    })
  })

  return (
    <div className="tarjeta">
      <h2>Nuevo post (RHF + Zod + useMutation)</h2>

      <form onSubmit={alEnviar} noValidate>
        <label htmlFor="title">
          Título
          <input
            id="title"
            type="text"
            placeholder="Ej: Aprendiendo TanStack Query"
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title')}
          />
          {errors.title && (
            <span id="title-error" className="error-campo">
              {errors.title.message}
            </span>
          )}
        </label>

        <label htmlFor="body">
          Contenido
          <textarea
            id="body"
            rows={4}
            placeholder="Escribe aquí el contenido del post…"
            aria-invalid={errors.body ? 'true' : 'false'}
            aria-describedby={errors.body ? 'body-error' : undefined}
            {...register('body')}
          />
          {errors.body && (
            <span id="body-error" className="error-campo">
              {errors.body.message}
            </span>
          )}
        </label>

        <div>
          <button type="submit" disabled={isSubmitting || crear.isPending}>
            {crear.isPending ? 'Enviando…' : 'Crear post'}
          </button>
        </div>
      </form>

      {crear.isSuccess && (
        <p className="estado ok" role="status">
          Post creado (id remoto: {crear.data.id}). La lista se ha invalidado y
          refrescado automáticamente.
        </p>
      )}
      {crear.isError && (
        <p className="estado error" role="alert">
          Falló el envío: {crear.error.message}
        </p>
      )}
    </div>
  )
}
