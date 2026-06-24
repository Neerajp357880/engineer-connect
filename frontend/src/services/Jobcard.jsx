import API from "../services/api";

function JobCard({ job }) {

  const applyJob = async () => {
    try {
      await API.put(`/jobs/apply/${job._id}`);
      alert("Applied Successfully");
    } catch (error) {
      alert("Application Failed");
    }
  };

  return (
    <div className="job-card">
      <h2>{job.title}</h2>

      <p>{job.description}</p>

      <p>📍 {job.location}</p>

      <p>💰 ₹ {job.salary}</p>

      <button className="btn" onClick={applyJob}>
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;