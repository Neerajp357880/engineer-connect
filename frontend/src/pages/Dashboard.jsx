import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaChartSimple,
  FaCircleCheck,
  FaLocationDot,
  FaPlus,
  FaUserTie,
} from "react-icons/fa6";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [jobsRes, appliedRes, myJobsRes, profileRes] = await Promise.allSettled([
          API.get("/jobs"),
          API.get("/jobs/applied-jobs"),
          API.get("/jobs/my-jobs"),
          API.get("/users/profile"),
        ]);

        if (jobsRes.status === "fulfilled") setJobs(jobsRes.value.data || []);
        if (appliedRes.status === "fulfilled") setAppliedJobs(appliedRes.value.data || []);
        if (myJobsRes.status === "fulfilled") setMyJobs(myJobsRes.value.data || []);
        if (profileRes.status === "fulfilled") setProfile(profileRes.value.data || {});
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const latestJobs = useMemo(() => jobs.slice(0, 3), [jobs]);
  const userName = profile.firstName ? `${profile.firstName} ${profile.lastName || ""}`.trim() : "there";

  const stats = [
    { label: "Available Jobs", value: jobs.length, icon: FaBriefcase },
    { label: "Applied Jobs", value: appliedJobs.length, icon: FaCircleCheck },
    { label: "Posted By You", value: myJobs.length, icon: FaUserTie },
  ];

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <motion.section
          className="dashboard-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Namaste, {userName}</h1>
            <p>Track jobs, applications, and hiring activity from your connected backend.</p>
          </div>
          <Link className="primary-button" to="/jobs">
            <FaPlus />
            Explore Jobs
          </Link>
        </motion.section>

        <section className="stats-grid">
          {stats.map(({ label, value, icon: Icon }, index) => (
            <motion.div
              className="stat-card"
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="stat-icon">
                <Icon />
              </div>
              <span>{label}</span>
              <strong>{loading ? "..." : value}</strong>
            </motion.div>
          ))}
        </section>

        <section className="content-grid">
          <motion.div className="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Latest openings</p>
                <h2>Fresh jobs</h2>
              </div>
              <FaChartSimple />
            </div>

            {latestJobs.length ? (
              <div className="mini-list">
                {latestJobs.map((job) => (
                  <Link className="mini-job" to="/jobs" key={job._id}>
                    <span>{job.title}</span>
                    <small>
                      <FaLocationDot />
                      {job.location || "Location flexible"}
                    </small>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty-text">No jobs found yet. Add jobs from backend to see them here.</p>
            )}
          </motion.div>

          <motion.div className="panel profile-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="eyebrow">Account</p>
            <div className="avatar">{(profile.firstName || "U").charAt(0).toUpperCase()}</div>
            <h2>{userName}</h2>
            <p>{profile.email || "No email loaded"}</p>
            <span className="role-pill">{profile.role || "Member"}</span>
          </motion.div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
