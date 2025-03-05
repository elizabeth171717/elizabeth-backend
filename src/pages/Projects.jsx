import { Link } from "react-router-dom";

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <h2>Projects</h2>
      <div>
        <div className="project-card">
          <h3>Taekwondo Gym Website</h3>
          <p>
            A responsive website for a local gym, built with HTML, CSS, and
            JavaScript.
          </p>
          <Link to="/gymwebsite">View Project</Link>
        </div>
        <div className="project-card">
          <h3>Construction Company Website</h3>
          <p>A modern landing page designed for a construction business.</p>
          <a
            href="https://yourproject.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
