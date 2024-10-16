// TaskModel.js - модель задачи
import { makeAutoObservable } from 'mobx' // Для создания наблюдаемых объектов

const generateId = () => Date.now().toString() // Функция генерации уникального ID

export class TaskModel {
	// Класс модели задачи
	id: string // Уникальный ID задачи
	title: string // Заголовок задачи
	text: string // Текст задачи
	isCompleted: boolean // Флаг завершения задачи
	subTasks: TaskModel[] // Массив подзадач
	createdAt: Date // Дата создания задачи

	constructor(title: string, text: string, isCompleted: boolean = false) {
		// Конструктор модели задачи
		this.id = generateId()
		this.title = title
		this.text = text
		this.isCompleted = isCompleted
		this.subTasks = []
		this.createdAt = new Date()
		makeAutoObservable(this) // Делаем объект наблюдаемым
	}

	addSubTask(subTask: TaskModel) {
		// Добавление подзадачи
		this.subTasks.push(subTask)
	}

	editTaskTitle(newTitle: string) {
		// Изменение заголовка задачи
		this.title = newTitle
	}

	editTaskText(newText: string) {
		// Изменение текста задачи
		this.text = newText
	}

	findParentTask = (taskList: TaskModel[], subTask: TaskModel): TaskModel | null => {
		// Найти родительскую задачу
		for (const task of taskList) {
			if (task.subTasks.includes(subTask)) {
				return task
			}

			const parent = this.findParentTask(task.subTasks, subTask)
			if (parent) {
				return parent
			}
		}

		return null
	}

	cocked(e: boolean) {
		// Установка флага завершения задачи и всех подзадач
		this.isCompleted = e
		this.subTasks.forEach((subTask) => subTask.cocked(this.isCompleted))
	}

	setCompleted(isCompleted: boolean) {
		// Установка флага завершения задачи
		this.isCompleted = isCompleted
	}
}
