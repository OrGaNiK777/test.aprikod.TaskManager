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
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [taskTitle, setTaskTitle] = useState('')
	const [taskText, setTaskText] = useState('')
	const [searchQuery, setSearchQuery] = useState('')

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
	const closeEditModal = () => {
		setIsEditModalOpen(false)
		setTaskTitle('')
		setTaskText('')
		setSelectedTask(null)
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

	const handleEditTask = (task: TaskModel) => {
		setTaskTitle(task.title)
		setTaskText(task.text)
		setIsEditModalOpen(true)
	}

	const handleSaveEditTask = () => {
		if (selectedTask && (taskTitle.trim() === '' || taskText.trim() === '')) {
			alert('Заголовок и текст задачи не могут быть пустыми!')
			return
		}
		if (selectedTask) {
			selectedTask.editTaskTitle(taskTitle)
			selectedTask.editTaskText(taskText)
			taskStore.saveToLocalStorage()
		}
		closeEditModal()
	}

	const handleDeleteTask = () => {
		if (selectedTask) {
			const parentTask = selectedTask.findParentTask(taskStore.tasks, selectedTask)
			if (parentTask) {
				taskStore.deleteSubTask(parentTask, selectedTask)
			} else {
				taskStore.deleteTask(selectedTask)
			}
			setSelectedTask(null)
		}
	}

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value)
	}

	const clearSearch = () => {
		setSearchQuery('')
	}

	return (
		<div style={{ display: 'flex', padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
			<div style={{ flex: 1, marginRight: '20px' }}>
				<h1 style={{ color: '#333', fontSize: '2em' }}>Task Manager</h1>
				<div style={{ position: 'relative', marginBottom: '10px' }}>
					<input type='text' placeholder='Поиск по заголовку...' value={searchQuery} onChange={handleSearchChange} style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em' }} />
					{searchQuery && (
						<button
							onClick={clearSearch}
							style={{
								position: 'absolute',
								right: '10px',
								top: '50%',
								transform: 'translateY(-50%)',
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								color: '#007bff',
								fontSize: '1.2em',
							}}
						>
							✖️
						</button>
					)}
				</div>
				<button onClick={() => setIsTaskModalOpen(true)} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
					Добавить задачу
				</button>
				<TaskList tasks={taskStore.tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))} onSelect={handleSelectTask} />
			</div>
			<div style={{ width: '750px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fff' }}>
				{selectedTask ? (
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<TaskDetail task={selectedTask} />
						<div style={{ display: 'flex', justifyContent: 'space-around' }}>
							<button
								onClick={() => {
									setIsSubTaskModalOpen(true)
								}}
								style={{ width: '150px', marginTop: '10px', padding: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
							>
								Добавить подзадачу
							</button>
							<button onClick={() => handleEditTask(selectedTask)} style={{ width: '150px', marginTop: '10px', padding: '5px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
								Редактировать
							</button>
							<button onClick={handleDeleteTask} style={{ marginTop: '10px', padding: '5px', backgroundColor: '#f44336', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
								Удалить задачу
							</button>
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
			{isEditModalOpen && selectedTask && (
				<Modal onClose={closeEditModal}>
					<div style={{ minWidth: '500px', display: 'flex', flexDirection: 'column', rowGap: '15px' }}>
						<h2 style={{ fontSize: '1.5em' }}>Редактировать "{selectedTask.title}"</h2>
						<input type='text' value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder='Заголовок' maxLength={25} style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1em' }} />
						<textarea value={taskText} onChange={(e) => setTaskText(e.target.value)} placeholder='Текст' maxLength={1000} style={{ minWidth: '500px', width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1em' }} />
						<button onClick={handleSaveEditTask} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
							Сохранить изменения
						</button>
					</div>
				</Modal>
			)}
		</div>
	)
})

export default App
