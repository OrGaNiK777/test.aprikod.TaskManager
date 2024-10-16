// Modal.js - компонент модального окна
import React from 'react'
import ReactDOM from 'react-dom' // Для рендеринга модального окна вне стандартной иерархии
import { themeStore } from '../stores/ThemeStore' // Импорт хранилища тем

// Интерфейс для props компонента
interface TaskModalProps {
	onClose: () => void // Функция закрытия модального окна
	title: string // Заголовок модального окна
	taskTitle: string // Заголовок задачи
	setTaskTitle: (title: string) => void // Функция для изменения заголовка задачи
	taskText: string // Текст задачи
	setTaskText: (text: string) => void // Функция для изменения текста задачи
	handleSubmit: () => void // Функция отправки формы
	buttonText: string // Текст кнопки отправки
}

const Modal: React.FC<TaskModalProps> = ({ onClose, title, taskTitle, setTaskTitle, taskText, setTaskText, handleSubmit, buttonText }) => {
	// Функциональный компонент
	return ReactDOM.createPortal(
		// Рендеринг модального окна вне стандартной иерархии DOM
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				className={themeStore.inputClassName}
				style={{
					position: 'relative',
					padding: '20px',
					borderRadius: '5px',
					border: '1px solid #B5B5B5',
					boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
				}}
			>
				{/* Кнопка закрытия */}
				<button
					onClick={onClose}
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						fontSize: '16px',
					}}
				>
					✖️
				</button>
				{/* Содержимое модального окна */}
				<div style={{ minWidth: '500px', display: 'flex', flexDirection: 'column', rowGap: '15px' }}>
					<h2 style={{ fontSize: '1.5em', marginTop: '0' }}>{title}</h2>
					{/* Поля ввода */}
					<input className={themeStore.inputClassName} type='text' value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder='Заголовок задачи' maxLength={25} style={{ padding: '10px', marginBottom: '10px', fontSize: '1em' }} />
					<textarea className={themeStore.inputClassName} value={taskText} onChange={(e) => setTaskText(e.target.value)} placeholder='Текст задачи' maxLength={1000} style={{ minWidth: '500px', padding: '10px', marginBottom: '10px', fontSize: '1em' }} />
					{/* Кнопка отправки */}
					<button
						onClick={handleSubmit}
						style={{
							padding: '10px 20px',
							backgroundColor: '#28a745',
							color: '#fff',
							border: 'none',
							borderRadius: '5px',
							cursor: 'pointer',
							fontSize: '1em',
						}}
					>
						{buttonText}
					</button>
				</div>
			</div>
		</div>,
		document.body // Рендеринг в body
	)
}

export default Modal
