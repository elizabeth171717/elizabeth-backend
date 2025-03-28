import { useState } from "react";
import AboutGymWebsite from "../components/AboutGymWebsite";
import AboutOrderForm from "../components/AboutFoodForm";

const Projects = () => {
  const [isGymModalOpen, setGymModalOpen] = useState(false);
  const [isOrderFormModalOpen, setOrderFormModalOpen] = useState(false);

  return (
    <section id="projects" className="projects">
      <h2 className="page-title">Projects</h2>
      <div>
        <div className="project-card">
          <h3>Taekwondo Gym Website</h3>
          <p>
            A responsive landing page for a local gym, built with HTML, CSS, and
            JavaScript.
          </p>
          <div className="project-links">
            <a
              href="https://olveratkdpeakatl.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </a>
            <a
              href="https://github.com/elizabeth171717/olveramartialarts/tree/main"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Code
            </a>
            <button onClick={() => setGymModalOpen(true)}>About</button>
          </div>
        </div>
        <div className="project-card">
          <h3>Food Ordering Form</h3>
          <p>A modern ordering form for a catering business</p>
          <div className="project-links">
            <a
              href="https://www.rricuratamales.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </a>
            <a
              href="https://github.com/elizabeth171717/rricura-ordering-form"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Code
            </a>
            <button onClick={() => setOrderFormModalOpen(true)}>About</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AboutGymWebsite
        isOpen={isGymModalOpen}
        onClose={() => setGymModalOpen(false)}
      />
      <AboutOrderForm
        isOpen={isOrderFormModalOpen}
        onClose={() => setOrderFormModalOpen(false)}
      />
    </section>
  );
};

export default Projects;
