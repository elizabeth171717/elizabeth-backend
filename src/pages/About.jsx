import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="hero">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Hello, I am a Frontend Developer
      </motion.h2>
      <p>I build responsive and user-friendly websites.</p>
    </div>
  );
};

export default About;
