import React from "react";

const Sidebar = ({ jobs, selectedJob, onJobSelect }) => {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="space-y-2 p-4">
                {jobs.length === 0 && (
                    <div className="text-gray-400 text-sm">No jobs yet. Paste a job URL above to analyze.</div>
                )}
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        onClick={() => onJobSelect(job)}
                        className={`p-3 rounded-md cursor-pointer ${selectedJob?.id === job.id ? "bg-gray-800" : "bg-gray-900 hover:bg-gray-800"
                            }`}
                    >
                        <div className="text-sm text-white truncate">{job.title}</div>
                        <div className="text-xs text-gray-400 truncate">{job.url}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;