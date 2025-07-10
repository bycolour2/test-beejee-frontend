export type Theme = 'dark' | 'light'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const currentTheme: Theme = localStorage.getItem('theme') as Theme || "light"

export const useTheme = () => {
  const toggleTheme = () => {
    const element = document.documentElement
    element.classList.toggle('dark')

    const isDark = element.classList.contains('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')

    element.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }

  const setTheme = (theme?: Theme) => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(theme || "light")
  }

  return {
    currentTheme,
    toggleTheme,
    setTheme
  }
}