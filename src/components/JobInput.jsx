import React, { useState } from 'react';

const JobInput = ({ onAddJob, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        requirements: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.company || !formData.description) {
            alert('Please fill in required fields (Title, Company, Description)');
            return;
        }

        const newJob = {
            ...formData,
            requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req)
        };

        onAddJob(newJob);
        setFormData({
            title: '',
            company: '',
            location: '',
            type: 'Full-time',
            salary: '',
            description: '',
            requirements: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-white font-semibold mb-3">Add New Job Posting</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Job Title *"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm focus:border-violet-500 focus:outline-none"
                    required
                />

                <input
                    type="text"
                    name="company"
                    placeholder="Company *"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm focus:border-violet-500 focus:outline-none"
                    required
                />

                <div className="flex gap-2">
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm focus:border-violet-500 focus:outline-none"
                    />

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm focus:border-violet-500 focus:outline-none"
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>

                <input
                    type="text"
                    name="salary"
                    placeholder="Salary (e.g., $100k - $150k)"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm focus:border-violet-500 focus:outline-none"
                />

                <input
                    type="text"
                    name="requirements"
                    placeholder="Requirements (comma separated)"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm focus:border-violet-500 focus:outline-none"
                />

                <textarea
                    name="description"
                    placeholder="Job Description *"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full h-24 p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm resize-none focus:border-violet-500 focus:outline-none"
                    required
                />

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded text-sm transition-colors"
                    >
                        Add Job
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobInput;