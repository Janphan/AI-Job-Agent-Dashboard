import React, { useState, useEffect } from 'react';
import AddJobModal from './AddJobModal';

const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-cyan-400';
    if (score >= 60) return 'text-violet-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
};

const getMatchScoreBg = (score) => {
    if (score >= 90) return 'from-emerald-500/10 to-green-500/10 border-emerald-500/30';
    if (score >= 75) return 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30';
    if (score >= 60) return 'from-violet-500/10 to-purple-500/10 border-violet-500/30';
    if (score >= 40) return 'from-amber-500/10 to-orange-500/10 border-amber-500/30';
    return 'from-red-500/10 to-pink-500/10 border-red-500/30';
};

const getMatchLabel = (score) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 75) return 'Strong Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
};

const getScoreEmoji = (score) => {
    if (score >= 90) return '🚀';
    if (score >= 75) return '⭐';
    if (score >= 60) return '👍';
    if (score >= 40) return '⚠️';
    return '❌';
};

const breakdownItems = [
    { key: 'technical_skills', icon: '🛠️', label: 'Technical Skills', max: 40 },
    { key: 'experience_and_projects', icon: '💼', label: 'Experience & Projects', max: 30 },
    { key: 'education_and_soft_skills', icon: '🎓', label: 'Education & Soft Skills', max: 20 },
    { key: 'bonus_points', icon: '🚀', label: 'Bonus / Nice-to-have', max: 10 },
];

function JobCard({ job, onClick }) {
    const score = job.score_breakdown?.total_match_score ?? 0;
    const strengthsCount = job.strengths?.length ?? 0;
    const missingCount = job.missing_skills?.length ?? 0;
    const date = job.date ? new Date(job.date).toLocaleDateString() : '';

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 shadow-2xl hover:border-violet-500/50 hover:bg-gray-800/80 transition-all duration-200 group"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 truncate mb-2">{job.url}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        {strengthsCount > 0 && (
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                                ✅ {strengthsCount} strengths
                            </span>
                        )}
                        {missingCount > 0 && (
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full">
                                ⚠️ {missingCount} to improve
                            </span>
                        )}
                        <span className="text-gray-500">{date}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <span className={`text-3xl font-bold ${getMatchScoreColor(score)}`}>
                        {score}%
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">{getMatchLabel(score)}</span>
                </div>
            </div>
        </button>
    );
}

function DetailView({ job, onBack }) {
    const score = job.score_breakdown?.total_match_score ?? 0;
    const dots = '🔵'.repeat(Math.round(score / 10)) + '░░'.repeat(10 - Math.round(score / 10));

    if (!job.score_breakdown) {
        return (
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white transition-colors mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Feed
                </button>
                <p className="text-gray-400 text-center py-8">No analysis data available for this job.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white transition-colors mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Feed
            </button>

            <div className="mb-6">
                <p className="text-sm text-gray-400 break-all">{job.url}</p>
                {job.date && <p className="text-xs text-gray-500 mt-1">Analyzed {new Date(job.date).toLocaleString()}</p>}
            </div>

            <div className="space-y-8">
                <div className={`p-6 rounded-xl border bg-gradient-to-r backdrop-blur-sm ${getMatchScoreBg(score)}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">{getScoreEmoji(score)}</span>
                            <div>
                                <h3 className="text-xl font-semibold text-white">Total Match Score</h3>
                                <p className="text-gray-400 text-sm">{getMatchLabel(score)}</p>
                            </div>
                        </div>
                        <div className={`text-5xl font-bold ${getMatchScoreColor(score)}`}>{score}%</div>
                    </div>
                    <div className="text-lg tracking-wider">{dots}</div>
                </div>

                {job.score_breakdown && (
                    <div className="bg-gray-900/50 border border-gray-700/50 p-6 rounded-xl backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                            <span className="mr-2">📊</span>Score Breakdown
                        </h3>
                        <div className="space-y-5">
                            {breakdownItems.map(({ key, icon, label, max }) => {
                                const val = job.score_breakdown[key] || 0;
                                const pct = Math.round((val / max) * 100);
                                return (
                                    <div key={key}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-gray-300 text-sm flex items-center">
                                                <span className="mr-2">{icon}</span>{label}
                                            </span>
                                            <span className="text-white font-semibold tabular-nums">{val} / {max}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full transition-all duration-500 ${val >= max ? 'bg-emerald-500' : val >= max * 0.75 ? 'bg-cyan-500' : val >= max * 0.5 ? 'bg-violet-500' : val >= max * 0.25 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {job.strengths?.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 p-6 rounded-xl backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center">
                            <span className="mr-3 text-2xl">✅</span>Your Strengths
                        </h3>
                        <div className="space-y-3">
                            {job.strengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-500/5 rounded-lg">
                                    <span className="text-emerald-400 mt-1">•</span>
                                    <p className="text-gray-300 leading-relaxed">{strength}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {job.missing_skills?.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 rounded-xl backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-amber-400 mb-4 flex items-center">
                            <span className="mr-3 text-2xl">⚠️</span>Skills to Improve
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {job.missing_skills.map((skill, index) => (
                                <span key={index} className="px-4 py-2 bg-amber-600/20 text-amber-300 rounded-full text-sm border border-amber-600/30 font-medium backdrop-blur-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {job.summary && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-6 rounded-xl backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                            <span className="mr-3 text-2xl">📝</span>Summary & Recommendations
                        </h3>
                        <div className="bg-blue-500/5 p-4 rounded-lg">
                            <p className="text-gray-300 leading-relaxed">{job.summary}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const JobAnalyzer = () => {
    const [jobs, setJobs] = useState(() => {
        try { return JSON.parse(localStorage.getItem('jobs') || '[]'); } catch { return []; }
    });
    const [cvText, setCvText] = useState(() => localStorage.getItem('cvText') || '');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }, [jobs]);

    useEffect(() => {
        localStorage.setItem('cvText', cvText);
    }, [cvText]);

    const handleJobAdded = (data) => {
        const newJob = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...data,
        };
        setJobs((prev) => [newJob, ...prev]);
        setSelectedJob(newJob);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-violet-900/30">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        🤖 AI Job Analyzer
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {selectedJob ? 'Analysis Results' : 'Job Feed — your analyzed jobs'}
                    </p>
                </div>

                {selectedJob ? (
                    <DetailView job={selectedJob} onBack={() => setSelectedJob(null)} />
                ) : jobs.length === 0 ? (
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-16 shadow-2xl text-center">
                        <div className="text-6xl mb-6">📋</div>
                        <h2 className="text-2xl font-semibold text-white mb-3">No jobs analyzed yet</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Tap the <span className="text-violet-400">+</span> button below to add a job URL and analyze it against your CV.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full shadow-2xl hover:shadow-violet-500/40 flex items-center justify-center text-3xl transition-all duration-200 hover:scale-110 z-40"
            >
                +
            </button>

            {showModal && (
                <AddJobModal
                    cvText={cvText}
                    onCvTextChange={setCvText}
                    onClose={() => setShowModal(false)}
                    onJobAdded={handleJobAdded}
                />
            )}
        </div>
    );
};

export default JobAnalyzer;
