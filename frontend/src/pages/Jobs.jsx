import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaBriefcase, FaFilter, FaLocationDot, FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import API from "../services/api";

const emptyJob = {
  title: "",
  description: "",
  location: "",
  salary: "",
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [formData, setFormData] = useState(emptyJob);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/jobs");
      setJobs(res.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const locations = useMemo(() => {
    const values = jobs.map((job) => job.location).filter(Boolean);
    return ["all", ...new Set(values)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = `${job.title} ${job.description} ${job.location}`.toLowerCase();
      const matchesQuery = searchText.includes(query.toLowerCase());
      const matchesLocation = location === "all" || job.location === location;
      return matchesQuery && matchesLocation;
    });
  }, [jobs, location, query]);

  const createJob = async (event) => {
    event.preventDefault();
    setCreating(true);
    setMessage("");

    try {
      await API.post("/jobs/create", formData);
      setFormData(emptyJob);
      setMessage("Job created successfully.");
      fetchJobs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create job.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="section-heading jobs-heading">
          <div>
            <p className="eyebrow">Job board</p>
            <h1>Available Jobs</h1>
          </div>
          <div className="job-count">
            <FaBriefcase />
            {filteredJobs.length} shown
          </div>
        </section>

        <section className="job-tools">
          <label className="search-box">
            <FaMagnifyingGlass />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, description, location"
            />
          </label>

          <label className="select-box">
            <FaFilter />
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All locations" : item}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="jobs-layout">
          <motion.form
            className="panel create-job"
            onSubmit={createJob}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Post work</p>
                <h2>Create Job</h2>
              </div>
              <FaPlus />
            </div>

            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Job title"
              required
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short job description"
              required
            />
            <input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Location"
            />
            <input
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="Salary"
            />

            <button className="primary-button full" disabled={creating}>
              {creating ? "Creating..." : "Create Job"}
            </button>
            {message && <p className="form-message">{message}</p>}
          </motion.form>

          <div className="jobs-grid">
            {loading && <p className="empty-text">Loading jobs...</p>}
            {!loading &&
              filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplied={() => setMessage("Application submitted.")}
                />
              ))}
            {!loading && !filteredJobs.length && (
              <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FaLocationDot />
                <h3>No matching jobs</h3>
                <p>Try a different search or clear the location filter.</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Jobs;
