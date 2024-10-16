// TaskDetail.js - компонент для отображения деталей задачи
import React from 'react'
import { TaskModel } from '../models/TaskModel' // Импорт модели задачи

// Интерфейс для props компонента
interface TaskDetailProps {
	task: TaskModel // Задача
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
	// Функциональный компонент
	return (
		<div style={{ width: '100%' }}>
			<h2 style={{ color: '#007bff' }}>{task.title}</h2>
			<p style={{ wordBreak: 'break-word' }}>{task.text}</p>
		</div>
	)
}

export default TaskDetail
