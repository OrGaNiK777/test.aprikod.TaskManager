import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TaskModel } from '../models/TaskModel'
import SubTask from './SubTask'
import { TaskStore } from '../stores/TaskStore'

interface TaskProps {
	task: TaskModel
	onSelect: (task: TaskModel) => void
	taskStore: TaskStore
}

const Task: React.FC<TaskProps> = observer(({ task, onSelect, taskStore }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const toggleExpanded = () => setIsExpanded(!isExpanded)

	const handleCheckboxChange = (task: TaskModel, e: boolean) => {
		task.cocked(e)
		task.setCompleted(task.subTasks.every((st) => st.isCompleted))
		taskStore.saveToLocalStorage()
	}

	const handleSubTaskCheckboxChange = (task: TaskModel, subTask: TaskModel, e: boolean) => {
		subTask.cocked(e)
		task.setCompleted(task.subTasks.every((st) => st.isCompleted))
		taskStore.saveToLocalStorage()
	}

	return (
		<div style={{ padding: '10px', borderRadius: '5px', marginTop: '5px' }}>
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
