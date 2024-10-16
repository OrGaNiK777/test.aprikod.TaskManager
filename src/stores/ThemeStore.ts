// ThemeStore.js - хранилище тем
import { makeAutoObservable } from 'mobx' // Для создания наблюдаемых объектов

type Theme = 'light' | 'dark' | 'auto' // Тип для темы

class ThemeStore {
	// Класс хранилища тем
	theme: Theme = 'auto' // Текущая тема

	constructor() {
		// Конструктор хранилища тем
		makeAutoObservable(this) // Делаем объект наблюдаемым
		this.loadTheme() // Загрузка темы из localStorage
	}

	loadTheme() {
		// Загрузка темы из localStorage
		const savedTheme = (localStorage.getItem('theme') as Theme) || 'auto'
		this.setTheme(savedTheme)
	}

	setTheme(newTheme: Theme) {
		// Установка новой темы
		this.theme = newTheme
		localStorage.setItem('theme', newTheme)
	}

	get inputClassName() {
		// Вычисляемое свойство для получения класса темы
		return this.theme === 'dark' ? 'dark' : this.theme === 'light' ? 'light' : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}
}

export const themeStore = new ThemeStore() // Экземпляр хранилища тем
