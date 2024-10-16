// index.js - точка входа приложения
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // Импорт глобальных стилей
import App from './App' // Импорт главного компонента приложения

// Создаем корневой элемент для рендеринга React приложения
const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement // Приводим к HTMLElement для безопасности типов
)

// Рендерим приложение в корневой элемент, используя React.StrictMode для дополнительной проверки
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
