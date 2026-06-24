import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaEnvelope, FaIdBadge, FaLock, FaUser } from "react-icons/fa6";
import API from "../services/api";

const roles = ["Engineer", "Worker", "Supervisor", "Contractor", "Admin"];

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Engineer",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.post("/auth/register", formData);
      setMessage("Account created. Redirecting to login...");
      setTimeout(() => navigate("/"), 700);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page register-page">
      <motion.form
        className="auth-card wide"
        onSubmit={handleRegister}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="eyebrow">Create profile</p>
        <h2>Register</h2>

        <div className="two-col">
          <label className="field">
            <span>First name</span>
            <div>
              <FaUser />
              <input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Aarav"
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Last name</span>
            <div>
              <FaUser />
              <input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Sharma"
                required
              />
            </div>
          </label>
        </div>

        <label className="field">
          <span>Email</span>
          <div>
            <FaEnvelope />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div>
            <FaLock />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create password"
              required
            />
          </div>
        </label>

        <label className="field">
          <span>Role</span>
          <div>
            <FaIdBadge />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
        </label>

        {message && <p className="form-message">{message}</p>}

        <button className="primary-button full" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
          <FaArrowRight />
        </button>

        <p className="auth-switch">
          Already registered? <Link to="/">Login</Link>
        </p>
      </motion.form>

      <motion.section
        className="auth-visual compact"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="auth-badge">MongoDB + Express + React</div>
        <h1>Build your hiring profile in seconds.</h1>
        <p>Register, login, browse jobs, apply, and view your profile from one responsive interface.</p>
      </motion.section>
    </main>
  );
}

export default Register;
