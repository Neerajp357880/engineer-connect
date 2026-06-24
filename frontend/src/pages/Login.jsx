import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaEnvelope, FaLock } from "react-icons/fa6";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <motion.section
        className="auth-visual"
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="auth-badge">Live job network</div>
        <h1>Find skilled engineering work faster.</h1>
        <p>
          A responsive job portal connected with your Node and MongoDB backend.
        </p>
        <div className="floating-stats">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <strong>24/7</strong>
            <span>Job discovery</span>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4.5 }}>
            <strong>Fast</strong>
            <span>Applications</span>
          </motion.div>
        </div>
      </motion.section>

      <motion.form
        className="auth-card"
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <p className="eyebrow">Welcome back</p>
        <h2>Login</h2>

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
              placeholder="Enter password"
              required
            />
          </div>
        </label>

        {message && <p className="form-message">{message}</p>}

        <button className="primary-button full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
          <FaArrowRight />
        </button>

        <p className="auth-switch">
          New user? <Link to="/register">Create account</Link>
        </p>
      </motion.form>
    </main>
  );
}

export default Login;
