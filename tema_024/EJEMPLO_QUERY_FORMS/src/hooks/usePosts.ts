import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { borrarPost, crearPost, obtenerPosts } from '../api/posts'
import type { PostNuevo } from '../types'

export const clavesPosts = {
  lista: ['posts'] as const,
}

export function usePosts() {
  return useQuery({
    queryKey: clavesPosts.lista,
    queryFn: obtenerPosts,
  })
}

export function useCrearPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (datos: PostNuevo) => crearPost(datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clavesPosts.lista })
    },
  })
}

export function useBorrarPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => borrarPost(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clavesPosts.lista })
    },
  })
}
