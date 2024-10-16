// Task.js - компонент для отображения отдельной задачи
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite' // Для реактивности с MobX
import { TaskModel } from '../models/TaskModel' // Импорт модели задачи
import SubTask from './SubTask' // Импорт компонента подзадачи
import { TaskStore } from '../stores/TaskStore' // Импорт хранилища задач

// Интерфейс для props компонента
interface TaskProps {
	task: TaskModel // Задача
	onSelect: (task: TaskModel) => void // Функция для выбора задачи
	taskStore: TaskStore // Хранилище задач
}

const Task: React.FC<TaskProps> = observer(({ task, onSelect, taskStore }) => {
	// Функциональный компонент, использующий observer для реактивности
	const [isExpanded, setIsExpanded] = useState(false) // Состояние раскрытия подзадач

	const toggleExpanded = () => setIsExpanded(!isExpanded) // Функция для переключения состояния раскрытия

	const handleCheckboxChange = (task: TaskModel, e: boolean) => {
		// Обработчик изменения чекбокса задачи
		task.cocked(e)
		task.setCompleted(task.subTasks.every((st) => st.isCompleted))
		taskStore.saveToLocalStorage()
	}

	const handleSubTaskCheckboxChange = (task: TaskModel, subTask: TaskModel, e: boolean) => {
		// Обработчик изменения чекбокса подзадачи
		subTask.cocked(e)
		task.setCompleted(task.subTasks.every((st) => st.isCompleted))
		taskStore.saveToLocalStorage()
	}

	return (
		<div style={{ padding: '10px', borderRadius: '5px', marginTop: '5px' }}>
			{/* Чекбокс и заголовок задачи */}
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<span onClick={toggleExpanded} style={{ cursor: 'pointer', marginRight: '8px', fontSize: '20px' }}>
					{isExpanded ? '▲' : '►'}
				</span>
				<input type='checkbox' checked={task.isCompleted} onChange={(e) => handleCheckboxChange(task, e.target.checked)} />
				<span
					style={{
						cursor: 'pointer',
						marginLeft: '8px',
					}}
					onClick={() => {
						onSelect(task)
					}}
				>
					{task.title}
				</span>
			</div>
			{/* Список подзадач, отображается если задача раскрыта */}
			{isExpanded && (
				<div>
					{task.subTasks.map((subTask, index) => (
						<SubTask key={index} task={task} subTask={subTask} onSelect={onSelect} handleSubTaskCheckboxChange={handleSubTaskCheckboxChange} />
					))}
				</div>
			)}
		</div>
	)
})

export default Task
