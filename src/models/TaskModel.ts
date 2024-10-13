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

	editTaskTitle(newTitle: string) {
		this.title = newTitle
	}

	editTaskText(newText: string) {
		this.text = newText
	}

	findParentTask = (taskList: TaskModel[], subTask: TaskModel): TaskModel | null => {
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

	toggleCompletion(e: boolean) {
		this.setCompleted(e) 
		this.subTasks.forEach((subTask) => subTask.toggleCompletion(this.isCompleted))
	}

	setCompleted(isCompleted: boolean) {
		this.isCompleted = isCompleted 
	}
}
