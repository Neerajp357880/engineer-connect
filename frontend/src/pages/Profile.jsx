import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaIdBadge, FaLayerGroup, FaUser } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Profile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setUser(res.data || {});
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const details = [
    { label: "Full Name", value: fullName, icon: FaUser },
    { label: "Email", value: user.email || "Not available", icon: FaEnvelope },
    { label: "Role", value: user.role || "Member", icon: FaIdBadge },
    {
      label: "Skills",
      value: user.skills?.length ? user.skills.join(", ") : "No skills added",
      icon: FaLayerGroup,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="page-shell profile-page">
        <motion.section
          className="profile-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="avatar big">{fullName.charAt(0).toUpperCase()}</div>
          <div>
            <p className="eyebrow">Profile</p>
            <h1>{loading ? "Loading..." : fullName}</h1>
            <p>{user.role || "EngineerConnect member"}</p>
          </div>
        </motion.section>

        {message && <p className="form-message">{message}</p>}

        <section className="profile-grid">
          {details.map(({ label, value, icon: Icon }, index) => (
            <motion.div
              className="detail-card"
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Icon />
              <span>{label}</span>
              <strong>{loading ? "..." : value}</strong>
            </motion.div>
          ))}
        </section>
      </main>
    </>
  );
}

export default Profile;
