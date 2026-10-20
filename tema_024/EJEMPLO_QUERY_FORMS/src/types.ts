export type Post = {
  id: number
  userId: number
  title: string
  body: string
}

export type PostNuevo = Pick<Post, 'title' | 'body'> & { userId?: number }
