import React, { useState, useEffect } from 'react';
import AddJobModal from './AddJobModal';

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

function JobCard({ job, onClick }) {
    const score = job.score_breakdown?.total_match_score ?? 0;
    const strengthsCount = job.strengths?.length ?? 0;
    const missingCount = job.missing_skills?.length ?? 0;
    const date = job.date ? new Date(job.date).toLocaleDateString() : '';

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-surface-card border border-border-default rounded-2xl p-5 shadow-2xl hover:border-border-active/50 hover:bg-surface-card-hover transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-muted truncate mb-2">{job.url}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        {strengthsCount > 0 && (
                            <span className="px-2 py-1 bg-status-success-bg text-status-success rounded-full">
                                ✅ {strengthsCount} strengths
                            </span>
                        )}
                        {missingCount > 0 && (
                            <span className="px-2 py-1 bg-status-warning-bg text-status-warning rounded-full">
                                ⚠️ {missingCount} to improve
                            </span>
                        )}
                        <span className="text-text-placeholder">{date}</span>
                    </div>
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

function DetailView({ job, onBack }) {
    const score = job.score_breakdown?.total_match_score ?? 0;
    const dots = '🔵'.repeat(Math.round(score / 10)) + '░░'.repeat(10 - Math.round(score / 10));

    if (!job.score_breakdown) {
        return (
            <div className="bg-surface-card border border-border-default rounded-2xl p-8 shadow-2xl">
                <button onClick={onBack} className="flex items-center text-text-muted hover:text-text-heading transition-colors mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Feed
                </button>
                <p className="text-text-muted text-center py-8">No analysis data available for this job.</p>
            </div>
        );
    }

    return (
        <div className="bg-surface-card border border-border-default rounded-2xl p-8 shadow-2xl">
            <button onClick={onBack} className="flex items-center text-text-muted hover:text-text-heading transition-colors mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Feed
            </button>

            <div className="mb-6">
                <p className="text-sm text-text-muted break-all">{job.url}</p>
                {job.date && <p className="text-xs text-text-placeholder mt-1">Analyzed {new Date(job.date).toLocaleString()}</p>}
            </div>

            <div className="space-y-8">
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

                {job.score_breakdown && (
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
                )}

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
        <div className="min-h-screen bg-surface-page">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-text-heading mb-4 bg-gradient-to-r from-interactive-primary to-purple-400 bg-clip-text text-transparent">
                        🤖 AI Job Analyzer
                    </h1>
                    <p className="text-text-muted text-lg">
                        {selectedJob ? 'Analysis Results' : 'Job Feed — your analyzed jobs'}
                    </p>
                </div>

                {selectedJob ? (
                    <DetailView job={selectedJob} onBack={() => setSelectedJob(null)} />
                ) : jobs.length === 0 ? (
                    <div className="bg-surface-card border border-border-default rounded-2xl p-16 shadow-2xl text-center">
                        <div className="text-6xl mb-6">📋</div>
                        <h2 className="text-2xl font-semibold text-text-heading mb-3">No jobs analyzed yet</h2>
                        <p className="text-text-muted mb-8 max-w-md mx-auto">
                            Tap the <span className="text-interactive-primary">+</span> button below to add a job URL and analyze it against your CV.
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
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-interactive-primary to-purple-600 hover:from-interactive-primary-hover hover:to-purple-500 text-text-heading rounded-full shadow-2xl hover:shadow-interactive-primary/40 flex items-center justify-center text-3xl transition-all duration-200 hover:scale-110 z-40"
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
