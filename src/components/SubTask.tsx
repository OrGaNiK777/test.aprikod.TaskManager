// SubTask.js - компонент для отображения подзадачи
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite' // Для реактивности с MobX
import { TaskModel } from '../models/TaskModel' // Импорт модели задачи

// Интерфейс для props компонента
interface TaskProps {
	task: TaskModel // Родительская задача
	subTask: TaskModel // Подзадача
	onSelect: (task: TaskModel) => void // Функция для выбора задачи
	handleSubTaskCheckboxChange: (task: TaskModel, subTask: TaskModel, e: boolean) => void // Функция для обработки изменения чекбокса подзадачи
}

const SubTask: React.FC<TaskProps> = observer(({ task, subTask, onSelect, handleSubTaskCheckboxChange }) => {
	// Функциональный компонент, использующий observer для реактивности
	const [isExpanded, setIsExpanded] = useState(false) // Состояние раскрытия вложенных подзадач

	const toggleExpanded = () => setIsExpanded(!isExpanded) // Функция для переключения состояния раскрытия

	return (
		<div style={{ marginLeft: '20px', padding: '5px', borderRadius: '5px' }}>
			{/* Чекбокс и заголовок подзадачи */}
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<span onClick={toggleExpanded} style={{ cursor: 'pointer', marginRight: '8px', fontSize: '20px' }}>
					{isExpanded ? '▲' : '►'}
				</span>
				<input type='checkbox' checked={subTask.isCompleted} onChange={(e) => handleSubTaskCheckboxChange(task, subTask, e.target.checked)} />
				<span
					style={{ cursor: 'pointer', marginLeft: '8px' }}
					onClick={() => {
						onSelect(subTask)
					}}
				>
					{subTask.title}
				</span>
			</div>
			{/* Список вложенных подзадач, отображается если подзадача раскрыта */}
			{isExpanded && (
				<div>
					{subTask.subTasks.map((childSubTask, index) => (
						<SubTask key={index} task={subTask} subTask={childSubTask} onSelect={onSelect} handleSubTaskCheckboxChange={handleSubTaskCheckboxChange}></SubTask>
					))}
				</div>
			)}
		</div>
	)
})

export default SubTask
