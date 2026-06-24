import { useState } from "react";
import { motion } from "framer-motion";
import { FaLocationDot, FaPaperPlane, FaRegClock, FaUserTie } from "react-icons/fa6";
import API from "../services/api";

function formatDate(value) {
  if (!value) return "New";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function JobCard({ job, onApplied }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const poster = job.postedBy;
  const companyName =
    typeof poster === "object" && poster
      ? `${poster.firstName || ""} ${poster.lastName || ""}`.trim() || poster.email
      : "Hiring Team";

  const applyJob = async () => {
    setLoading(true);
    setStatus("");

    try {
      await API.put(`/jobs/apply/${job._id}`);
      setStatus("Applied successfully");
      onApplied?.(job._id);
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to apply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.article
      className="job-card"
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="job-card-top">
        <div>
          <p className="eyebrow">Open position</p>
          <h3>{job.title}</h3>
        </div>
        <span className="salary">Rs. {job.salary || "Negotiable"}</span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="meta-grid">
        <span>
          <FaLocationDot />
          {job.location || "Remote / On site"}
        </span>
        <span>
          <FaUserTie />
          {companyName}
        </span>
        <span>
          <FaRegClock />
          {formatDate(job.createdAt)}
        </span>
      </div>

      <div className="job-actions">
        <button className="primary-button" onClick={applyJob} disabled={loading}>
          <FaPaperPlane />
          {loading ? "Applying..." : "Apply Now"}
        </button>
        {status && <span className="inline-status">{status}</span>}
      </div>
    </motion.article>
  );
}

export default JobCard;
