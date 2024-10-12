import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TaskModel } from '../models/TaskModel'

interface TaskProps {
	task: TaskModel
	onSelect: (task: TaskModel) => void
}

const SubTask: React.FC<TaskProps> = observer(({ task, onSelect }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const toggleExpanded = () => setIsExpanded(!isExpanded)

	return (
		<div style={{ marginLeft: '20px', padding: '5px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<span onClick={toggleExpanded} style={{ cursor: 'pointer', marginRight: '8px', fontSize: '20px' }}>
					{isExpanded ? '▼' : '►'}
				</span>
				<input type='checkbox' />
				<span
					style={{
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
						<SubTask key={index} task={subTask} onSelect={onSelect}></SubTask>
					))}
				</div>
			)}
		</div>
	)
})

export default SubTask
