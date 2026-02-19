import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import JobDetail from "./components/JobDetail";
import JobInput from "./components/JobInput";

function App() {
    // start with empty list (no mock data)
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleJobSelect = (job) => setSelectedJob(job);

    const handleAddJob = (newJob) => {
        const jobWithId = { id: Date.now(), ...newJob };
        setJobs([jobWithId, ...jobs]);
        setSelectedJob(jobWithId);
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <div className="flex flex-col w-96 border-r border-gray-700">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Job Listings</h2>
                </div>
                <div className="p-4">
                    <JobInput onAddJob={handleAddJob} />
                </div>
                <Sidebar jobs={jobs} selectedJob={selectedJob} onJobSelect={handleJobSelect} />
            </div>

            <JobDetail job={selectedJob} />
        </div>
    );
}

export default App;