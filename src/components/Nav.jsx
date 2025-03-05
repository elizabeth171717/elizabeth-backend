import { NavLink } from "react-router-dom";
import { FaUser, FaFolderOpen, FaMobileAlt } from "react-icons/fa";

const Nav = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active-li" : "")}
          >
            <FaUser /> Me
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? "active-li" : "")}
          >
            <FaFolderOpen /> Portfolio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active-li" : "")}
          >
            <FaMobileAlt /> Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
