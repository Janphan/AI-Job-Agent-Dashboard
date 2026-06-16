import React, { useState, useEffect } from 'react';
import AddJobModal from './AddJobModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-score-excellent';
    if (score >= 75) return 'text-score-strong';
    if (score >= 60) return 'text-score-good';
    if (score >= 40) return 'text-score-fair';
    return 'text-score-low';
};

const getMatchScoreBg = (score) => {
    if (score >= 90) return 'bg-status-success-bg border-status-success-border';
    if (score >= 75) return 'bg-status-info-bg border-status-info-border';
    if (score >= 60) return 'bg-interactive-primary-muted border-border-active/30';
    if (score >= 40) return 'bg-status-warning-bg border-status-warning-border';
    return 'bg-status-error-bg border-status-error-border';
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

const getBarColor = (val, max) => {
    if (val >= max) return 'bg-score-excellent';
    if (val >= max * 0.75) return 'bg-score-strong';
    if (val >= max * 0.5) return 'bg-score-good';
    if (val >= max * 0.25) return 'bg-score-fair';
    return 'bg-score-low';
};

const extractDomain = (url) => {
    try {
        const host = new URL(url).hostname;
        return host.replace('www.', '').split('.')[0];
    } catch {
        return url;
    }
};

function JobCard({ job, onClick }) {
    const score = job.score_breakdown?.total_match_score ?? 0;
    const domain = extractDomain(job.url);
    const title = job.title || domain;
    const company = job.company || '';
    const location = job.location || '';

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-surface-card border border-border-default rounded-2xl p-5 shadow-2xl hover:border-border-active/50 hover:bg-surface-card-hover transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 bg-surface-elevated text-text-placeholder text-xs rounded mb-2">
                        {domain}
                    </span>
                    <h3 className="text-text-heading font-semibold truncate">{title}</h3>
                    {(company || location) && (
                        <p className="text-sm text-text-muted truncate mt-0.5">
                            {company}{company && location ? ' · ' : ''}{location}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <span className={`text-3xl font-bold ${getMatchScoreColor(score)}`}>
                        {score}%
                    </span>
                    <span className="text-xs text-text-placeholder mt-0.5">{getMatchLabel(score)}</span>
                </div>
            </div>
        </button>
    );
}

function DetailModal({ job, onClose, onDelete }) {
    const score = job.score_breakdown?.total_match_score ?? 0;
    const dots = '🔵'.repeat(Math.round(score / 10)) + '░░'.repeat(10 - Math.round(score / 10));

    const handleDelete = () => {
        if (window.confirm('Delete this job analysis?')) {
            onDelete(job.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8">
            <div className="bg-surface-modal border border-border-default rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl my-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-text-heading truncate">
                            {job.title || 'Job Analysis'}
                        </h2>
                        {(job.company || job.location) && (
                            <p className="text-text-muted text-sm mt-1">
                                {job.company}{job.company && job.location ? ' · ' : ''}{job.location}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            className="p-2 text-status-error hover:bg-status-error-bg rounded-lg transition-all duration-200"
                            title="Delete"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-text-muted hover:text-text-heading hover:bg-interactive-ghost-hover rounded-lg transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-interactive-primary hover:text-interactive-primary-hover break-all underline"
                    >
                        {job.url}
                    </a>
                    {job.date && (
                        <p className="text-xs text-text-placeholder mt-1">Analyzed {new Date(job.date).toLocaleString()}</p>
                    )}
                </div>

                {job.score_breakdown ? (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl border ${getMatchScoreBg(score)}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl">{getScoreEmoji(score)}</span>
                                    <div>
                                        <h3 className="text-xl font-semibold text-text-heading">Total Match Score</h3>
                                        <p className="text-text-muted text-sm">{getMatchLabel(score)}</p>
                                    </div>
                                </div>
                                <div className={`text-5xl font-bold ${getMatchScoreColor(score)}`}>{score}%</div>
                            </div>
                            <div className="text-lg tracking-wider">{dots}</div>
                        </div>

                        <div className="bg-surface-input border border-border-default p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-text-heading mb-6 flex items-center">
                                <span className="mr-2">📊</span>Score Breakdown
                            </h3>
                            <div className="space-y-5">
                                {breakdownItems.map(({ key, icon, label, max }) => {
                                    const val = job.score_breakdown[key] || 0;
                                    const pct = Math.round((val / max) * 100);
                                    return (
                                        <div key={key}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-text-body text-sm flex items-center">
                                                    <span className="mr-2">{icon}</span>{label}
                                                </span>
                                                <span className="text-text-heading font-semibold tabular-nums">{val} / {max}</span>
                                            </div>
                                            <div className="w-full bg-surface-elevated rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(val, max)}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {job.strengths?.length > 0 && (
                            <div className="bg-status-success-bg border border-status-success-border p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-status-success mb-4 flex items-center">
                                    <span className="mr-3 text-2xl">✅</span>Your Strengths
                                </h3>
                                <div className="space-y-3">
                                    {job.strengths.map((strength, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-status-success-bg/50 rounded-lg">
                                            <span className="text-status-success mt-1">•</span>
                                            <p className="text-text-body leading-relaxed">{strength}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {job.missing_skills?.length > 0 && (
                            <div className="bg-status-warning-bg border border-status-warning-border p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-status-warning mb-4 flex items-center">
                                    <span className="mr-3 text-2xl">⚠️</span>Skills to Improve
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {job.missing_skills.map((skill, index) => (
                                        <span key={index} className="px-4 py-2 bg-status-warning-bg text-status-warning rounded-full text-sm border border-status-warning-border font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {job.summary && (
                            <div className="bg-status-info-bg border border-status-info-border p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-status-info mb-4 flex items-center">
                                    <span className="mr-3 text-2xl">📝</span>Summary & Recommendations
                                </h3>
                                <div className="bg-status-info-bg/50 p-4 rounded-lg">
                                    <p className="text-text-body leading-relaxed">{job.summary}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-text-muted text-center py-8">No analysis data available for this job.</p>
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
    const [detailJob, setDetailJob] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

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
        setDetailJob(newJob);
    };

    const handleDeleteJob = async (jobId) => {
        try {
            await fetch(`${API_BASE_URL}/jobs/${jobId}`, { method: 'DELETE' });
        } catch {
            // ignore server error, still remove from local state
        }
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        setDetailJob(null);
    };

    return (
        <div className="min-h-screen bg-surface-page">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-text-heading mb-4 bg-gradient-to-r from-interactive-primary to-purple-400 bg-clip-text text-transparent">
                        🤖 AI Job Analyzer
                    </h1>
                    <p className="text-text-muted text-lg">Job Feed — your analyzed jobs</p>
                </div>

                {jobs.length === 0 && (
                    <div className="bg-surface-card border border-border-default rounded-2xl p-16 shadow-2xl text-center">
                        <div className="text-6xl mb-6">📋</div>
                        <h2 className="text-2xl font-semibold text-text-heading mb-3">No jobs analyzed yet</h2>
                        <p className="text-text-muted mb-4 max-w-md mx-auto">
                            Tap <span className="text-interactive-primary">+</span> to add a job URL and start analyzing.
                        </p>
                    </div>
                )}

                {jobs.length > 0 && (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} onClick={() => setDetailJob(job)} />
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-interactive-primary to-purple-600 hover:from-interactive-primary-hover hover:to-purple-500 text-text-heading rounded-full shadow-2xl hover:shadow-interactive-primary/40 flex items-center justify-center text-3xl transition-all duration-200 hover:scale-110 z-40"
            >
                +
            </button>

            {showAddModal && (
                <AddJobModal
                    cvText={cvText}
                    onCvTextChange={setCvText}
                    onClose={() => setShowAddModal(false)}
                    onJobAdded={handleJobAdded}
                />
            )}

            {detailJob && (
                <DetailModal job={detailJob} onClose={() => setDetailJob(null)} onDelete={handleDeleteJob} />
            )}
        </div>
    );
};

export default JobAnalyzer;
