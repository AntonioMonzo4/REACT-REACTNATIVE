import { useState } from 'react'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'
import { Badge } from './ui/Badge.jsx'

const COLORES = [
  'bg-blue-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-amber-500',
  'bg-rose-500',
]

export default function App() {
  const [oscuro, setOscuro] = useState(false)

  return (
    <div className={oscuro ? 'dark min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-50 text-slate-900'}>
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">M12 · Diseño con Tailwind</h1>
          <Button variant={oscuro ? 'secondary' : 'primary'} onClick={() => setOscuro((v) => !v)}>
            {oscuro ? 'Modo claro' : 'Modo oscuro'}
          </Button>
        </header>

        <Card>
          <h2 className="mb-2 text-lg font-semibold">
            UI kit mínimo <Badge tone="green">ui/</Badge>
          </h2>
          <p className="mb-3 text-sm opacity-80">
            <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">Button</code>,{' '}
            <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">Card</code> y{' '}
            <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">Badge</code>{' '}
            composables con <code>clsx</code>.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold">Tokens de color</h2>
          <div className="flex flex-wrap gap-2">
            {COLORES.map((c) => (
              <div key={c} className={`h-12 w-12 rounded-lg ${c}`} />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold">Otros enfoques del módulo</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm opacity-80">
            <li>MUI / Chakra — componentes con theme (ver docs/Unidad_02 y 03)</li>
            <li>shadcn/ui — copiar snippets Radix + Tailwind a tu repo (docs/Unidad_04)</li>
            <li>CSS Modules / styled-components — docs/Unidad_05</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
