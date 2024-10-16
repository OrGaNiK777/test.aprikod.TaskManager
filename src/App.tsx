// App.js - главный компонент приложения
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite' // Для реактивности с MobX
import { TaskStore } from './stores/TaskStore' // Импорт хранилища задач
import TaskList from './components/TaskList' // Импорт компонента списка задач
import TaskDetail from './components/TaskDetail' // Импорт компонента деталей задачи
import { TaskModel } from './models/TaskModel' // Импорт модели задачи
import Modal from './components/Modal' // Импорт компонента модального окна
import ThemeToggle from './components/ThemeToggle' // Импорт компонента переключения темы
import { themeStore } from './stores/ThemeStore' // Импорт хранилища тем
import './App.css' // Импорт стилей для App

// Создаем экземпляр хранилища задач
const taskStore = new TaskStore()

const App: React.FC = observer(() => {
	// observer делает компонент реактивным на изменения в MobX
	// Состояния компонента
	const [selectedTask, setSelectedTask] = useState<null | TaskModel>(null) // Выбранная задача
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false) // Флаг открытия модального окна добавления задачи
	const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false) // Флаг открытия модального окна добавления подзадачи
	const [isEditModalOpen, setIsEditModalOpen] = useState(false) // Флаг открытия модального окна редактирования задачи
	const [taskTitle, setTaskTitle] = useState('') // Заголовок задачи (для модальных окон)
	const [taskText, setTaskText] = useState('') // Текст задачи (для модальных окон)
	const [searchQuery, setSearchQuery] = useState('') // Запрос для поиска

	// Обработчики событий

	const handleSelectTask = (task: TaskModel) => {
		// Выбор задачи
		setSelectedTask(task)
	}

	const closeTaskModal = () => {
		// Закрытие модального окна добавления задачи
		setIsTaskModalOpen(false)
		setTaskTitle('')
		setTaskText('')
	}

	const closeSubTaskModal = () => {
		// Закрытие модального окна добавления подзадачи
		setIsSubTaskModalOpen(false)
		setTaskTitle('')
		setTaskText('')
	}
	const closeEditModal = () => {
		// Закрытие модального окна редактирования задачи
		setIsEditModalOpen(false)
		setTaskTitle('')
		setTaskText('')
	}

	const handleAddTask = () => {
		// Добавление новой задачи
		if (taskTitle.trim() === '' || taskText.trim() === '') {
			alert('Заголовок и текст задачи не могут быть пустыми!')
			return
		}
		taskStore.addTask(taskTitle, taskText)
		closeTaskModal()
	}

	const handleAddSubTask = (parentTask: TaskModel) => {
		// Добавление подзадачи
		if (taskTitle.trim() === '' || taskText.trim() === '') {
			alert('Заголовок и текст подзадачи не могут быть пустыми!')
			return
		}
		taskStore.addSubTask(parentTask, taskTitle, taskText)
		closeSubTaskModal()
	}

	const handleEditTask = (task: TaskModel) => {
		// Открытие модального окна редактирования задачи
		setTaskTitle(task.title)
		setTaskText(task.text)
		setIsEditModalOpen(true)
	}

	const handleSaveEditTask = () => {
		// Сохранение изменений в задаче
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
		// Удаление задачи
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
		// Изменение поискового запроса
		setSearchQuery(event.target.value)
	}

	const clearSearch = () => {
		// Очистка поискового запроса
		setSearchQuery('')
	}

	return (
		<div className={themeStore.inputClassName} style={{ display: 'flex', padding: '20px', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
			{/* Список задач */}
			<div style={{ flex: 1, marginRight: '20px' }}>
				<ThemeToggle /> {/* Компонент для переключения темы */}
				<h1 style={{ fontSize: '2em' }}>Task Manager</h1>
				{/* Поле поиска */}
				<div style={{ position: 'relative', marginBottom: '10px' }}>
					<input className={themeStore.inputClassName} type='text' placeholder='Поиск по заголовку...' value={searchQuery} onChange={handleSearchChange} style={{ padding: '10px', width: '100%', borderRadius: '5px', fontSize: '1em' }} />
					{searchQuery && ( // Кнопка очистки поиска, отображается только если есть запрос
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
				{/* Кнопка добавления задачи */}
				<button onClick={() => setIsTaskModalOpen(true)} style={{ color: 'white', padding: '10px 20px', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
					Добавить задачу
				</button>
				{/* Список задач с фильтром по поисковому запросу */}
				<TaskList tasks={taskStore.tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))} onSelect={handleSelectTask} taskStore={taskStore} />
			</div>
			{/* Детали выбранной задачи */}
			<div style={{ width: '750px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', marginLeft: '15px' }}>
				{selectedTask ? (
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<TaskDetail task={selectedTask} />
						{/* Кнопки управления задачей */}
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
			{/* Модальные окна */}
			{isTaskModalOpen && <Modal onClose={closeTaskModal} title='Добавить новую задачу' taskTitle={taskTitle} setTaskTitle={setTaskTitle} taskText={taskText} setTaskText={setTaskText} handleSubmit={handleAddTask} buttonText='Создать задачу' />}
			{isSubTaskModalOpen && selectedTask && <Modal onClose={closeSubTaskModal} title={`Добавить подзадачу к "${selectedTask.title}"`} taskTitle={taskTitle} setTaskTitle={setTaskTitle} taskText={taskText} setTaskText={setTaskText} handleSubmit={() => handleAddSubTask(selectedTask)} buttonText='Создать подзадачу' />}
			{isEditModalOpen && selectedTask && <Modal onClose={closeEditModal} title={`Редактировать "${selectedTask.title}"`} taskTitle={taskTitle} setTaskTitle={setTaskTitle} taskText={taskText} setTaskText={setTaskText} handleSubmit={handleSaveEditTask} buttonText='Сохранить изменения' />}
		</div>
	)
})

export default App
