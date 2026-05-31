import { useState } from 'react';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';

function Portfolio() {
    const [items] = useState(projects);
    const [filter, setFilter] = useState('all');
    const categories = ['all', 'web', 'mobile', 'design'];

    const filteredItems = filter === 'all'
        ? items
        : items.filter(item => item.category === filter);

    return (
        <section id="portfolio" className="portfolio-section">
            <div className="container">
                <h2 className="text-center mb-5">My Portfolio</h2>
                <div className="filter-buttons">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${filter === category ? 'active' : ''}`}
                            onClick={() => setFilter(category)}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="portfolio-grid">
                    {filteredItems.map(project => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Portfolio;
