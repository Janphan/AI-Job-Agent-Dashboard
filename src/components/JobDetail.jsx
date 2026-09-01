import React, { useState } from 'react';
import { analyzeJob } from '../services/api';

const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-cyan-400';
    if (score >= 60) return 'text-violet-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
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
            setAnalysis(result);
        } catch (error) {
            alert('Failed to analyze: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
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

                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <div className="text-green-400 font-semibold text-lg">{job.salary}</div>
                </div>

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

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Job Description</h3>
                    <p className="text-gray-300 leading-relaxed">{job.description}</p>
                </div>
            </div>

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

            {analysis && analysis.score_breakdown && (
                <div className="space-y-6">
                    {/* Total Match Score */}
                    {(() => {
                        const score = analysis.score_breakdown.total_match_score;
                        return (
                            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getScoreEmoji(score)}</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Total Match Score</h3>
                                        </div>
                                    </div>
                                    <div className={`text-4xl font-bold ${getMatchScoreColor(score)}`}>
                                        {score}%
                                    </div>
                                </div>
                                <div className="text-base tracking-wider">
                                    {'🔵'.repeat(Math.round(score / 10))}{'░░'.repeat(10 - Math.round(score / 10))}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Years of Experience */}
                    {analysis.years_of_experience_required !== undefined && analysis.years_of_experience_required > 0 && (
                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                <span className="mr-2 text-xl">📅</span>
                                Experience Match
                            </h3>
                            <div className="flex items-center space-x-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-cyan-400">{analysis.years_of_experience_required}</div>
                                    <div className="text-gray-400 text-sm">Years Required</div>
                                </div>
                                <div className="text-gray-500 text-2xl">→</div>
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${analysis.candidate_years_of_experience >= analysis.years_of_experience_required ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {analysis.candidate_years_of_experience}
                                    </div>
                                    <div className="text-gray-400 text-sm">Your Experience</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Language Requirements */}
                    {analysis.language_requirements?.length > 0 && (
                        <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
                                <span className="mr-2 text-xl">🌐</span>
                                Language Requirements
                            </h3>
                            <div className="space-y-3">
                                {analysis.language_requirements.map((lang, i) => (
                                    <div key={i} className="flex items-center justify-between bg-gray-750 p-3 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-white font-medium">{lang.language}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${lang.is_required ? 'bg-red-600/20 text-red-300' : 'bg-gray-600/30 text-gray-300'}`}>
                                                {lang.is_required ? 'Required' : 'Nice to have'}
                                            </span>
                                            <span className="text-gray-400 text-sm">{lang.level}</span>
                                        </div>
                                        <span className={lang.candidate_has ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                                            {lang.candidate_has ? '✅ Met' : '❌ Not met'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Score Breakdown */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                            <span className="mr-2">📊</span>
                            Score Breakdown
                        </h3>
                        <div className="space-y-4">
                            {breakdownItems.map(({ key, icon, label, max }) => {
                                const val = analysis.score_breakdown[key] || 0;
                                const pct = Math.round((val / max) * 100);
                                return (
                                    <div key={key}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-gray-300 text-sm flex items-center">
                                                <span className="mr-2">{icon}</span>
                                                {label}
                                            </span>
                                            <span className="text-white font-semibold tabular-nums">
                                                {val} / {max}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Strengths */}
                    {analysis.strengths?.length > 0 && (
                        <div className="bg-gray-800 p-6 rounded-lg border border-emerald-500/30">
                            <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center">
                                <span className="mr-2 text-xl">✅</span>
                                Your Strengths
                            </h3>
                            <div className="space-y-2">
                                {analysis.strengths.map((s, i) => (
                                    <p key={i} className="text-gray-300 flex items-start">
                                        <span className="text-emerald-400 mr-2">•</span>
                                        {s}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing Skills */}
                    {analysis.missing_skills?.length > 0 && (
                        <div className="bg-gray-800 p-6 rounded-lg border border-amber-500/30">
                            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center">
                                <span className="mr-2 text-xl">⚠️</span>
                                Skills to Improve
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {analysis.missing_skills.map((s, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-amber-600/20 text-amber-300 rounded-full text-sm border border-amber-600/30">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {analysis.summary && (
                        <div className="bg-gray-800 p-6 rounded-lg border border-blue-500/30">
                            <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                                <span className="mr-2 text-xl">📝</span>
                                Summary & Recommendations
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobDetail;