import React from 'react'
import { TaskModel } from '../models/TaskModel'

interface TaskDetailProps {
	task: TaskModel
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
	return (
		<div style={{ width: '100%' }}>
			<h2 style={{ color: '#007bff' }}>{task.title}</h2>
			<p style={{ wordBreak: 'break-word' }}>{task.text}</p>
		</div>
	)
}

export default TaskDetail
