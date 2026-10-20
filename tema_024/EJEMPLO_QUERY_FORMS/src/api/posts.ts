import type { Post, PostNuevo } from '../types'

const BASE = 'https://jsonplaceholder.typicode.com'

export async function obtenerPosts(): Promise<Post[]> {
  const respuesta = await fetch(`${BASE}/posts?_limit=8`)
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status} al cargar posts`)
  }
  return respuesta.json() as Promise<Post[]>
}

export async function obtenerPost(id: number): Promise<Post> {
  const respuesta = await fetch(`${BASE}/posts/${id}`)
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status} al cargar el post ${id}`)
  }
  return respuesta.json() as Promise<Post>
}

export async function crearPost(datos: PostNuevo): Promise<Post> {
  const respuesta = await fetch(`${BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status} al crear el post`)
  }
  return respuesta.json() as Promise<Post>
}

export async function borrarPost(id: number): Promise<void> {
  const respuesta = await fetch(`${BASE}/posts/${id}`, { method: 'DELETE' })
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status} al borrar el post ${id}`)
  }
}
