import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBriefcase, FaChartLine, FaRightFromBracket, FaUser } from "react-icons/fa6";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartLine },
  { to: "/jobs", label: "Jobs", icon: FaBriefcase },
  { to: "/profile", label: "Profile", icon: FaUser },
];

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <NavLink to="/dashboard" className="brand">
        <span className="brand-mark">EC</span>
        <span>EngineerConnect</span>
      </NavLink>

      <div className="nav-links">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="nav-link">
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <button className="icon-button logout" onClick={logout} title="Logout">
        <FaRightFromBracket />
      </button>
    </motion.nav>
  );
}

export default Navbar;
