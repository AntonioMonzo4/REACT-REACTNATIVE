export type Tarea = { id: number; texto: string; hecha: boolean }

let contador = 3

const iniciales: Tarea[] = [
  { id: 1, texto: 'Leer la Unidad 02 de Playwright', hecha: false },
  { id: 2, texto: 'Ejecutar la suite con --ui', hecha: false },
]

export async function obtenerTareas(): Promise<Tarea[]> {
  await new Promise((r) => setTimeout(r, 100))
  return [...iniciales]
}

export async function anadirTarea(texto: string): Promise<Tarea> {
  await new Promise((r) => setTimeout(r, 100))
  const nueva: Tarea = { id: ++contador, texto, hecha: false }
  iniciales.push(nueva)
  return nueva
}
