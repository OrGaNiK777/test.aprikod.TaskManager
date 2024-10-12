import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TaskStore } from './stores/TaskStore'
import TaskList from './components/TaskList'
import TaskDetail from './components/TaskDetail'
import { TaskModel } from './models/TaskModel'
import Modal from './components/Modal'
import './App.css'

const taskStore = new TaskStore()

const App: React.FC = observer(() => {
	const [selectedTask, setSelectedTask] = useState<null | TaskModel>(null)
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
	const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false)
	const [taskTitle, setTaskTitle] = useState('')
	const [taskText, setTaskText] = useState('')

	const handleSelectTask = (task: TaskModel) => {
		setSelectedTask(task)
	}

	const closeTaskModal = () => {
		setIsTaskModalOpen(false)
		setTaskTitle('')
		setTaskText('')
	}

	const closeSubTaskModal = () => {
		setIsSubTaskModalOpen(false)
		setTaskTitle('')
		setTaskText('')
	}

	const handleAddTask = () => {
		if (taskTitle.trim() === '' || taskText.trim() === '') {
			alert('Заголовок и текст задачи не могут быть пустыми!')
			return
		}
		taskStore.addTask(taskTitle, taskText)
		closeTaskModal()
	}

	const handleAddSubTask = (parentTask: TaskModel) => {
		if (taskTitle.trim() === '' || taskText.trim() === '') {
			alert('Заголовок и текст подзадачи не могут быть пустыми!')
			return
		}
		taskStore.addSubTask(parentTask, taskTitle, taskText)
		closeSubTaskModal()
	}

	return (
		<div>
			<div>
				<h1>Task Manager</h1>
				<div style={{ position: 'relative', marginBottom: '10px' }}>
					<input type='text' placeholder='Поиск' />
					{<button>✖️</button>}
				</div>
				<button onClick={() => setIsTaskModalOpen(true)} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
					Добавить задачу
				</button>
				<TaskList tasks={taskStore.tasks} onSelect={handleSelectTask} />
			</div>
			<div style={{ width: '750px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fff' }}>
				{selectedTask ? (
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<TaskDetail task={selectedTask} />
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<button
								onClick={() => {
									setTaskTitle('')
									setTaskText('')
									setIsSubTaskModalOpen(true)
								}}
							>
								Добавить подзадачу
							</button>
							<button>Редактировать задачу</button>
							<button>Удалить задачу</button>
						</div>
					</div>
				) : (
					<p>Выберите задачу для просмотра деталей.</p>
				)}
			</div>
			{isTaskModalOpen && (
				<Modal onClose={closeTaskModal}>
					<div style={{ minWidth: '500px', display: 'flex', flexDirection: 'column', rowGap: '15px' }}>
						<h2 style={{ fontSize: '1.5em' }}>Добавить новую задачу</h2>
						<input type='text' value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder='Заголовок задачи' maxLength={25} style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1em' }} />
						<textarea value={taskText} onChange={(e) => setTaskText(e.target.value)} placeholder='Текст задачи' maxLength={1000} style={{ minWidth: '500px', width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1em' }} />
						<button onClick={handleAddTask} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
							Создать задачу
						</button>
					</div>
				</Modal>
			)}
			{isSubTaskModalOpen && selectedTask && (
				<Modal onClose={closeSubTaskModal}>
					<div style={{ minWidth: '500px', display: 'flex', flexDirection: 'column', rowGap: '15px' }}>
						<h2 style={{ fontSize: '1.5em' }}>Добавить подзадачу к "{selectedTask.title}"</h2>
						<input type='text' value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder='Заголовок подзадачи' maxLength={25} style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1em' }} />
						<textarea value={taskText} onChange={(e) => setTaskText(e.target.value)} placeholder='Текст подзадачи' maxLength={1000} style={{ minWidth: '500px', width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1em' }} />
						<button onClick={() => handleAddSubTask(selectedTask)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
							Создать подзадачу
						</button>
					</div>
				</Modal>
			)}
		</div>
	)
})

export default App
