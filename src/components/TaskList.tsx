import React from 'react'
import Task from './Task'
import { TaskModel } from '../models/TaskModel'
import { TaskStore } from '../stores/TaskStore'

interface TaskListProps {
	tasks: TaskModel[]
	onSelect: (task: TaskModel) => void
	taskStore: TaskStore 
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelect, taskStore }) => {
	return (
		<div>
			{tasks.map((task, index) => (
				<Task key={index} task={task} onSelect={onSelect} taskStore={taskStore} />
			))}
		</div>
	)
}

export default TaskList
