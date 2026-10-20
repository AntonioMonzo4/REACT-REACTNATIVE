import { useCallback, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext.js'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
