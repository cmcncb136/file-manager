import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

  function toggleTheme(): void {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    applyTheme()
  }

  function setTheme(theme: 'light' | 'dark'): void {
    isDarkMode.value = theme === 'dark'
    localStorage.setItem('theme', theme)
    applyTheme()
  }

  function applyTheme(): void {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }

  return { isDarkMode, toggleTheme, setTheme, applyTheme }
})
