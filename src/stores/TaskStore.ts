import { makeAutoObservable } from 'mobx'
import { TaskModel } from '../models/TaskModel'

export class TaskStore {
	tasks: TaskModel[] = []

	constructor() {
		makeAutoObservable(this)
		this.loadFromLocalStorage()
	}

	addTask(title: string, text: string) {
		const newTask = new TaskModel(title, text)
		this.tasks.push(newTask)
		this.saveToLocalStorage()
	}

	addSubTask(parentTask: TaskModel, title: string, text: string) {
		const newSubTask = new TaskModel(title, text)
		parentTask.addSubTask(newSubTask)
		this.saveToLocalStorage()
	}

	deleteTask(taskToDelete: TaskModel) {
		this.tasks = this.tasks.filter((task) => task !== taskToDelete)
		this.saveToLocalStorage()
	}

	deleteSubTask(parentTask: TaskModel, subTaskToDelete: TaskModel) {
		parentTask.subTasks = parentTask.subTasks.filter((subTask) => subTask !== subTaskToDelete)
		parentTask.subTasks.forEach((subTask) => {
			this.deleteSubTask(subTask, subTaskToDelete)
		})
		this.saveToLocalStorage()
	}

	saveToLocalStorage() {
		console.log(this.tasks)
		localStorage.setItem('tasks', JSON.stringify(this.tasks))
	}

	loadFromLocalStorage() {
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
		const newSubTask = new TaskModel(subTask.title, subTask.text, subTask.isCompleted)
		newSubTask.createdAt = new Date(subTask.createdAt)
		subTask.subTasks.forEach((nestedSubTask: any) => {
			newSubTask.addSubTask(this.createSubTask(nestedSubTask))
		})
		return newSubTask
	}
}
