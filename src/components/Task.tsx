import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TaskModel } from '../models/TaskModel'
import SubTask from './SubTask'

interface TaskProps {
	task: TaskModel
	onSelect: (task: TaskModel) => void
}

const Task: React.FC<TaskProps> = observer(({ task, onSelect }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const toggleExpanded = () => setIsExpanded(!isExpanded)

	const handleCheckboxChange = (task: TaskModel, e: boolean) => {
		task.toggleCompletion(e)
	}

	const handleSubTaskCheckboxChange = (task: TaskModel, subTask: TaskModel, e: boolean) => {
		subTask.toggleCompletion(e)
		task.setCompleted(task.subTasks.every((st) => st.isCompleted))
	}

	return (
		<div style={{padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9'}}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<span onClick={toggleExpanded} style={{ cursor: 'pointer', marginRight: '8px', fontSize: '20px' }}>
					{isExpanded ? '▼' : '►'}
				</span>
				<input type='checkbox' checked={task.isCompleted} onChange={(e) => handleCheckboxChange(task, e.target.checked)} />
				<span
					style={{
						textDecoration: task.isCompleted ? 'line-through' : 'none',
						cursor: 'pointer',
						marginLeft: '8px',
						flexGrow: 1,
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
