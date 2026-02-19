import React from 'react';
import JobCard from './JobCard';

const Sidebar = ({ jobs, selectedJob, onJobSelect }) => {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="space-y-2 p-4">
                {jobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        isSelected={selectedJob?.id === job.id}
                        onClick={() => onJobSelect(job)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;