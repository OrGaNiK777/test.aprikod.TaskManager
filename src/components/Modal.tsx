import React from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
	children: React.ReactNode
	onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
	return ReactDOM.createPortal(
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
				style={{
					backgroundColor: '#fff',
					padding: '20px',
					borderRadius: '5px',
					boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
				}}
			>
				<button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
					✖️
				</button>
				{children}
			</div>
		</div>,
		document.body
	)
}

export default Modal
