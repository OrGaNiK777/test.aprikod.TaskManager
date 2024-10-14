import { makeAutoObservable } from 'mobx'

type Theme = 'light' | 'dark' | 'auto'

class ThemeStore {
	theme: Theme = 'auto'

	constructor() {
		makeAutoObservable(this)
		this.loadTheme()
	}

	loadTheme() {
		const savedTheme = (localStorage.getItem('theme') as Theme) || 'auto'
		this.setTheme(savedTheme)
	}

	setTheme(newTheme: Theme) {
		this.theme = newTheme
		localStorage.setItem('theme', newTheme)
	}

	get inputClassName() {
		return this.theme === 'dark' ? 'dark' : this.theme === 'light' ? 'light' : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}
}

export const themeStore = new ThemeStore()
