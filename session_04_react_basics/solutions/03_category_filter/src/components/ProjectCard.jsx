function ProjectCard({ title, category, image, description, tags }) {
    return (
        <div className={`project-card ${category}`}>
            <div className="project-image">
                <img src={image} alt={title} />
            </div>
            <div className="project-content">
                <span className="project-category">{category}</span>
                <h3 className="project-title">{title}</h3>
                <p className="project-description">{description}</p>
                <div className="project-tags">
                    {tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
