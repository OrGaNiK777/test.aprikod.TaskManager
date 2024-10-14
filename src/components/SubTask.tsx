import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TaskModel } from '../models/TaskModel'

interface TaskProps {
	task: TaskModel
	subTask: TaskModel
	onSelect: (task: TaskModel) => void
	handleSubTaskCheckboxChange: (task: TaskModel, subTask: TaskModel, e: boolean) => void
}

const SubTask: React.FC<TaskProps> = observer(({ task, subTask, onSelect, handleSubTaskCheckboxChange }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const toggleExpanded = () => setIsExpanded(!isExpanded)

	return (
		<div style={{ marginLeft: '20px', padding: '5px', borderRadius: '5px'}}>
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
