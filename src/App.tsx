import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TaskStore } from './stores/TaskStore'
import TaskList from './components/TaskList'
import TaskDetail from './components/TaskDetail'
import { TaskModel } from './models/TaskModel'
import Modal from './components/Modal'
import ThemeToggle from './components/ThemeToggle'
import { ThemeStore } from './stores/ThemeStore'
import './App.css'

const taskStore = new TaskStore()
const themeStore = new ThemeStore()

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
		<div className={themeStore.inputClassName} style={{ display: 'flex', padding: '20px', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
			<div style={{ flex: 1, marginRight: '20px' }}>
				<ThemeToggle />
				<h1 style={{ fontSize: '2em' }}>Task Manager</h1>
				<div style={{ position: 'relative', marginBottom: '10px' }}>
					<input className={themeStore.inputClassName} type='text' placeholder='Поиск по заголовку...' value={searchQuery} onChange={handleSearchChange} style={{ padding: '10px', width: '100%', borderRadius: '5px', fontSize: '1em' }} />
					{searchQuery && (
						<button
							onClick={clearSearch}
							style={{
								position: 'absolute',
								right: '-15px',
								top: '50%',
								transform: 'translateY(-50%)',
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								fontSize: '1.2em',
							}}
						>
							✖️
						</button>
					)}
				</div>
				<button onClick={() => setIsTaskModalOpen(true)} style={{ color: 'white', padding: '10px 20px', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
					Добавить задачу
				</button>
				<TaskList tasks={taskStore.tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))} onSelect={handleSelectTask} taskStore={taskStore} />
			</div>
			<div style={{ width: '750px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', marginLeft: '15px' }}>
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
							<button onClick={handleDeleteTask} style={{ width: '150px', marginTop: '10px', padding: '5px', backgroundColor: '#f44336', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
								Удалить задачу
							</button>
						</div>
					</div>
				) : (
					<p>Выберите задачу для просмотра деталей.</p>
				)}
			</div>
			{isTaskModalOpen && <Modal onClose={closeTaskModal} title='Добавить новую задачу' taskTitle={taskTitle} setTaskTitle={setTaskTitle} taskText={taskText} setTaskText={setTaskText} handleSubmit={handleAddTask} buttonText='Создать задачу' />}
			{isSubTaskModalOpen && selectedTask && <Modal onClose={closeSubTaskModal} title={`Добавить подзадачу к "${selectedTask.title}"`} taskTitle={taskTitle} setTaskTitle={setTaskTitle} taskText={taskText} setTaskText={setTaskText} handleSubmit={() => handleAddSubTask(selectedTask)} buttonText='Создать подзадачу' />}
			{isEditModalOpen && selectedTask && <Modal onClose={closeEditModal} title={`Редактировать "${selectedTask.title}"`} taskTitle={taskTitle} setTaskTitle={setTaskTitle} taskText={taskText} setTaskText={setTaskText} handleSubmit={handleSaveEditTask} buttonText='Сохранить изменения' />}
		</div>
	)
})

export default App
