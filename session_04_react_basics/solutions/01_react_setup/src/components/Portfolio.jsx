function Portfolio() {
    const projects = [
        { id: 1, title: 'E-Commerce Website', category: 'Web', image: 'https://via.placeholder.com/400x300', description: 'React + Node.js full-stack application' },
        { id: 2, title: 'Mobile App', category: 'Mobile', image: 'https://via.placeholder.com/400x300', description: 'Mobile app for tracking fitness goals' }
    ];

    return (
        <section id="portfolio" className="container">
            <div className="section-title">
                <h2>Portfolio</h2>
            </div>
            <div className="portfolio-grid">
                {projects.map(project => (
                    <div key={project.id} className="project-card">
                        <img src={project.image} alt={project.title} />
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Portfolio;
