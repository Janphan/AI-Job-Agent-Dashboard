import React, { useState } from 'react';
import { analyzeJob } from '../services/api';

const JobDetail = ({ job }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cvText, setCvText] = useState('');

    const handleAnalyze = async () => {
        if (!cvText.trim()) {
            alert('Please enter your CV/resume text');
            return;
        }

        setLoading(true);
        try {
            const result = await analyzeJob(job.description, cvText);
            setAnalysis(result.analysis);
        } catch (error) {
            alert('Failed to analyze: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getMatchScoreColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 75) return 'text-cyan-400';
        if (score >= 60) return 'text-violet-400';
        return 'text-amber-400';
    };

    return (
        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
            {/* Job Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                        <p className="text-xl text-gray-300 mb-2">{job.company}</p>
                        <p className="text-gray-400">{job.location} • {job.type} • Posted {job.posted}</p>
                    </div>
                    <div className="text-right">
                        <div className={`text-3xl font-bold ${getMatchScoreColor(job.matchScore)}`}>
                            {job.matchScore}%
                        </div>
                        <div className="text-gray-400 text-sm">Match Score</div>
                    </div>
                </div>

                {/* Salary */}
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <div className="text-green-400 font-semibold text-lg">{job.salary}</div>
                </div>

                {/* Requirements */}
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-violet-600/20 text-violet-300 rounded-full text-sm"
                            >
                                {req}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Job Description</h3>
                    <p className="text-gray-300 leading-relaxed">{job.description}</p>
                </div>
            </div>

            {/* CV Analysis Section */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">AI Job Match Analysis</h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <textarea
                        value={cvText}
                        onChange={(e) => setCvText(e.target.value)}
                        placeholder="Paste your CV/resume content here to get AI-powered match analysis..."
                        className="w-full h-40 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 resize-none focus:border-violet-500 focus:outline-none"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="mt-4 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                    >
                        {loading ? 'Analyzing with AI...' : 'Analyze Job Match'}
                    </button>
                </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
                <div className="bg-gray-800 p-6 rounded-lg border border-violet-600/20">
                    <h3 className="text-xl font-semibold text-white mb-4">🤖 AI Analysis Results</h3>
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm overflow-x-auto">
                            {analysis}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetail;