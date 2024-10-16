// TaskList.js - компонент списка задач
import React from 'react'
import Task from './Task' // Импорт компонента отдельной задачи
import { TaskModel } from '../models/TaskModel' // Импорт модели задачи
import { TaskStore } from '../stores/TaskStore' // Импорт хранилища задач

// Интерфейс для props компонента
interface TaskListProps {
	tasks: TaskModel[] // Массив задач
	onSelect: (task: TaskModel) => void // Функция для выбора задачи
	taskStore: TaskStore // Хранилище задач
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelect, taskStore }) => {
	// Функциональный компонент
	return (
		<div>
			{/* Рендеринг списка задач */}
			{tasks.map((task, index) => (
				<Task key={index} task={task} onSelect={onSelect} taskStore={taskStore} /> // Ключ для оптимизации React
			))}
		</div>
	)
}

export default TaskList
