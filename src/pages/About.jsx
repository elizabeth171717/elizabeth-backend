import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="hero">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Hello, I am a Junior Web Developer
      </motion.h2>
      <p>
        I build responsive, user-friendly websites and dynamic web applications.
        I specialize in front-end and full-stack development, with a strong
        understanding of technologies like React, JavaScript, and MongoDB. I
        have hands-on experience developing real-world projects that enhance
        user experience and streamline business operations.
      </p>
      <p>
        I developed Rricura Order Form, an online food ordering system that
        simplifies catering orders with secure payments and automated email
        notifications. I also built a Taekwondo Gym Website, integrating
        animations and interactive features to enhance engagement and usability.
      </p>
      <p>
        I’m passionate about turning ideas into functional, beautifully designed
        websites while continuously improving my skills.I’m seeking an
        opportunity to collaborate with a team, contribute to impactful
        projects, and grow as a developer.
      </p>
      <p>Let’s connect—I’d love to bring my skills to your team!</p>
    </div>
  );
};

export default About;
