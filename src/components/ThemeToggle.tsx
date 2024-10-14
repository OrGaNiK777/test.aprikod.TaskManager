import { observer } from 'mobx-react-lite'
import { themeStore } from '../stores/ThemeStore'

const ThemeToggle: React.FC = observer(() => {
	return (
		<div>
			<label htmlFor='theme-selector'>Выберите тему: </label>
			<select id='theme-selector' value={themeStore.theme} onChange={(e) => themeStore.setTheme(e.target.value as 'light' | 'dark' | 'auto')}>
				<option value='auto'>Авто</option>
				<option value='light'>Светлая</option>
				<option value='dark'>Темная</option>
			</select>
		</div>
	)
})

export default ThemeToggle
