// TaskStore.js - хранилище задач
import { makeAutoObservable } from 'mobx' // Для создания наблюдаемых объектов
import { TaskModel } from '../models/TaskModel' // Импорт модели задачи

export class TaskStore {
	// Класс хранилища задач
	tasks: TaskModel[] = [] // Массив задач

	constructor() {
		// Конструктор хранилища задач
		makeAutoObservable(this) // Делаем объект наблюдаемым
		this.loadFromLocalStorage() // Загрузка задач из localStorage
	}

	addTask(title: string, text: string) {
		// Добавление новой задачи
		const newTask = new TaskModel(title, text)
		this.tasks.push(newTask)
		this.saveToLocalStorage() // Сохранение задач в localStorage
	}

	addSubTask(parentTask: TaskModel, title: string, text: string) {
		// Добавление подзадачи
		const newSubTask = new TaskModel(title, text)
		parentTask.addSubTask(newSubTask)
		this.saveToLocalStorage() // Сохранение задач в localStorage
	}

	deleteTask(taskToDelete: TaskModel) {
		// Удаление задачи
		this.tasks = this.tasks.filter((task) => task !== taskToDelete)
		this.saveToLocalStorage() // Сохранение задач в localStorage
	}

	deleteSubTask(parentTask: TaskModel, subTaskToDelete: TaskModel) {
		// Удаление подзадачи
		parentTask.subTasks = parentTask.subTasks.filter((subTask) => subTask !== subTaskToDelete)
		parentTask.subTasks.forEach((subTask) => {
			this.deleteSubTask(subTask, subTaskToDelete)
		})
		this.saveToLocalStorage() // Сохранение задач в localStorage
	}

	saveToLocalStorage() {
		// Сохранение задач в localStorage
		console.log(this.tasks)
		localStorage.setItem('tasks', JSON.stringify(this.tasks))
	}

	loadFromLocalStorage() {
		// Загрузка задач из localStorage
		const tasks = localStorage.getItem('tasks')
		try {
			if (tasks) {
				this.tasks = JSON.parse(tasks).map((task: any) => {
					const newTask = new TaskModel(task.title, task.text, task.isCompleted)
					newTask.createdAt = new Date(task.createdAt)
					task.subTasks.forEach((subTask: any) => {
						newTask.addSubTask(this.createSubTask(subTask))
					})
					return newTask
				})
			}
		} catch (error) {
			console.error('Ошибка при загрузке данных из localStorage:', error)
		}
	}

	createSubTask(subTask: any) {
		// Рекурсивная функция для создания подзадач
		const newSubTask = new TaskModel(subTask.title, subTask.text, subTask.isCompleted)
		newSubTask.createdAt = new Date(subTask.createdAt)
		subTask.subTasks.forEach((nestedSubTask: any) => {
			newSubTask.addSubTask(this.createSubTask(nestedSubTask))
		})
		return newSubTask
	}
}
