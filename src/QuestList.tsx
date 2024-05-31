import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Quest {
	name: string;
	current: number;
	max: number;
	// Add more properties for detailed information
}

interface DropdownProps {
	quests: Quest[];
}

const Dropdown: React.FC<DropdownProps> = ({ quests }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="Dropdown">
			<button className="Dropdown-button" onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? 'Close Quests' : 'Quests'}
			</button>

			<ul className={`Dropdown-content ${isOpen ? 'show' : ''}`}>
				{quests.map((quest, index) => (
					<li key={index} className="Dropdown-item">
						<Link to={`/quest/${quest.name}`}>
							<div className="quest-container">
								<div className="quest-text">
									{quest.name}
									<br />
								</div>
								<div className="progress-container">
									<progress value={quest.current} max={quest.max} />
									<span className="progress-label">
										{quest.current}/{quest.max}
									</span>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Dropdown;
