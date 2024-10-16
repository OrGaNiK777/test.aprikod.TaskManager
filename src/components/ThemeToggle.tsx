// ThemeToggle.js - компонент для переключения темы
import { observer } from 'mobx-react-lite' // Для реактивности с MobX
import { themeStore } from '../stores/ThemeStore' // Импорт хранилища тем

const ThemeToggle: React.FC = observer(() => {
	// Функциональный компонент, использующий observer для реактивности
	return (
		<div>
			<label htmlFor='theme-selector'>Выберите тему: </label>
			{/* Селект для выбора темы */}
			<select id='theme-selector' value={themeStore.theme} onChange={(e) => themeStore.setTheme(e.target.value as 'light' | 'dark' | 'auto')}>
				<option value='auto'>Авто</option>
				<option value='light'>Светлая</option>
				<option value='dark'>Темная</option>
			</select>
		</div>
	)
})

export default ThemeToggle
