import { useEffect, useMemo, useState } from 'react'
import ThemeContext from './ThemeContext'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  // value memorizado: evita cascadas de re-render en consumidores
  const value = useMemo(() => ({ theme, toggleTheme }), [theme])

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    return () => document.body.classList.remove('dark')
  }, [theme])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
