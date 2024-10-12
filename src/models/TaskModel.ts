import { makeAutoObservable } from 'mobx'

const generateId = () => Date.now().toString()

export class TaskModel {
	id: string
	title: string
	text: string
	isCompleted: boolean
	subTasks: TaskModel[]
	createdAt: Date

	constructor(title: string, text: string, isCompleted: boolean = false) {
		this.id = generateId()
		this.title = title
		this.text = text
		this.isCompleted = isCompleted
		this.subTasks = []
		this.createdAt = new Date()
		makeAutoObservable(this)
	}

	addSubTask(subTask: TaskModel) {
		this.subTasks.push(subTask)
	}
}
