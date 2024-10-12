import React from 'react'
import Task from './Task'
import { TaskModel } from '../models/TaskModel'

interface TaskListProps {
	tasks: TaskModel[]
	onSelect: (task: TaskModel) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelect }) => {
	return (
		<div>
			{tasks.map((task, index) => (
				<Task key={index} task={task} onSelect={onSelect}></Task>
			))}
		</div>
	)
}

export default TaskList
