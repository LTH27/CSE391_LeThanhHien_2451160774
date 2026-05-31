import { useState } from 'react';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';

function Portfolio() {
    const [items] = useState(projects);

    return (
        <section id="portfolio" className="portfolio-section">
            <div className="container">
                <h2 className="text-center mb-5">My Portfolio</h2>
                <div className="portfolio-grid">
                    {items.map(project => (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            category={project.category}
                            image={project.image}
                            description={project.description}
                            tags={project.tags}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Portfolio;
