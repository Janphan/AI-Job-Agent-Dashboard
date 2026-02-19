import React, { useState } from 'react';

const JobAnalyzer = () => {
    const [url, setUrl] = useState('');
    const [myCVText, setMyCVText] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyze = async () => {
        if (!url.trim() || !myCVText.trim()) {
            alert('Please provide both job URL and CV text');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jd_text: url,
                    cv_text: myCVText
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setAnalysisResult(result);
        } catch (error) {
            console.error("Backend connection error:", error);
            alert('Error connecting to backend: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const parseAnalysisResult = (result) => {
        try {
            // Try to parse the analysis string as JSON
            const analysisText = result.analysis || result;
            const parsed = JSON.parse(analysisText);
            return parsed;
        } catch {
            // If parsing fails, return as is
            return null;
        }
    };

    const getMatchScoreColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 75) return 'text-cyan-400';
        if (score >= 60) return 'text-violet-400';
        return 'text-amber-400';
    };

    const getMatchScoreBg = (score) => {
        if (score >= 90) return 'bg-green-500/10 border-green-500/20';
        if (score >= 75) return 'bg-cyan-500/10 border-cyan-500/20';
        if (score >= 60) return 'bg-violet-500/10 border-violet-500/20';
        return 'bg-amber-500/10 border-amber-500/20';
    };

    const parsedResult = analysisResult ? parseAnalysisResult(analysisResult) : null;

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">AI Job Analyzer</h1>

                {/* Input Section */}
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Job Analysis</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Job URL or Job Description
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste job URL here (e.g., https://jobs.company.com/job-id)"
                                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Your CV/Resume Text
                            </label>
                            <textarea
                                value={myCVText}
                                onChange={(e) => setMyCVText(e.target.value)}
                                placeholder="Paste your CV/resume content here..."
                                rows={8}
                                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-violet-500 focus:outline-none resize-none"
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Job Match'}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {analysisResult && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                            🤖 AI Analysis Results
                        </h2>

                        {analysisResult.error ? (
                            <div className="bg-red-900/20 border border-red-600 p-4 rounded-lg">
                                <p className="text-red-400">Error: {analysisResult.error}</p>
                            </div>
                        ) : parsedResult ? (
                            <div className="space-y-6">
                                {/* Match Score */}
                                {parsedResult.match_score && (
                                    <div className={`p-6 rounded-lg border ${getMatchScoreBg(parsedResult.match_score)}`}>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-white">Match Score</h3>
                                            <div className={`text-4xl font-bold ${getMatchScoreColor(parsedResult.match_score)}`}>
                                                {parsedResult.match_score}%
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Strengths */}
                                {parsedResult.strengths && parsedResult.strengths.length > 0 && (
                                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                                            ✅ Why this matches
                                        </h3>
                                        <ul className="space-y-2">
                                            {parsedResult.strengths.map((strength, index) => (
                                                <li key={index} className="text-gray-300 flex items-start">
                                                    <span className="text-green-400 mr-2">•</span>
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Missing Skills */}
                                {parsedResult.missing_skills && parsedResult.missing_skills.length > 0 && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center">
                                            ⚠️ Missing from your profile
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {parsedResult.missing_skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-amber-600/20 text-amber-300 rounded-full text-sm border border-amber-600/30"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Summary */}
                                {parsedResult.summary && (
                                    <div className="bg-gray-700/50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-white mb-3">📝 Summary</h3>
                                        <p className="text-gray-300 leading-relaxed">{parsedResult.summary}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Fallback for non-JSON response
                            <div className="bg-gray-900 p-4 rounded-lg">
                                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm overflow-x-auto">
                                    {analysisResult.analysis || JSON.stringify(analysisResult, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="animate-spin h-6 w-6 border-2 border-violet-500 border-t-transparent rounded-full"></div>
                                <span className="text-white">Analyzing job compatibility...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobAnalyzer;