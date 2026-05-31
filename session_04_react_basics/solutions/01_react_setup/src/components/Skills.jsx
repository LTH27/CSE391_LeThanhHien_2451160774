function Skills() {
    const skills = ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'];

    return (
        <section id="skills" className="container">
            <div className="section-title">
                <h2>Skills</h2>
            </div>
            <div className="skills-list">
                {skills.map(skill => (
                    <div key={skill} className="skill-card">{skill}</div>
                ))}
            </div>
        </section>
    );
}

export default Skills;
