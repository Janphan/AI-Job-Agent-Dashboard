import React, { useState } from 'react';

const JobAnalyzer = () => {
    const [url, setUrl] = useState('');
    const [myCVText, setMyCVText] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [uploadMode, setUploadMode] = useState('text');
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyze = async () => {
        if (!url.trim()) {
            alert('Please provide a job URL or job description');
            return;
        }

        if (uploadMode === 'text' && !myCVText.trim()) {
            alert('Please provide your CV text');
            return;
        }

        if (uploadMode === 'file' && !cvFile) {
            alert('Please upload a PDF CV file');
            return;
        }

        setLoading(true);

        try {
            let response;
            if (uploadMode === 'text') {
                response = await fetch('http://127.0.0.1:8000/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jd_text: url,
                        cv_text: myCVText
                    })
                });
            } else {
                const formData = new FormData();
                formData.append('jd_text', url);
                formData.append('cv_file', cvFile);

                response = await fetch('http://127.0.0.1:8000/analyze-with-pdf', {
                    method: 'POST',
                    body: formData
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setAnalysisResult(result);
        } catch (error) {
            console.error("Error:", error);
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getMatchScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 75) return 'text-cyan-400';
        if (score >= 60) return 'text-violet-400';
        if (score >= 40) return 'text-amber-400';
        return 'text-red-400';
    };

    const getMatchScoreBg = (score) => {
        if (score >= 90) return 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30';
        if (score >= 75) return 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30';
        if (score >= 60) return 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/30';
        if (score >= 40) return 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30';
        return 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30';
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setCvFile(file);
        } else {
            alert("Please select a PDF file.");
            e.target.value = '';
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setCvFile(file);
            } else {
                alert("Please select a PDF file.");
            }
        }
    };

    const getScoreEmoji = (score) => {
        if (score >= 90) return '🚀';
        if (score >= 75) return '⭐';
        if (score >= 60) return '👍';
        if (score >= 40) return '⚠️';
        return '❌';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-violet-900/30">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        🤖 AI Job Analyzer
                    </h1>
                    <p className="text-gray-400 text-lg">Get instant insights on how well your CV matches job requirements</p>
                </div>

                {/* Input Form */}
                <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                        <span className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center mr-3 text-sm">📊</span>
                        Job Analysis
                    </h2>

                    <div className="grid gap-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">
                                <span className="flex items-center">
                                    🔗 Job URL or Job Description
                                    <span className="ml-2 px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">Required</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste job URL here (e.g., https://linkedin.com/jobs/...)"
                                className="w-full p-4 bg-gray-700/50 text-white rounded-xl border border-gray-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">
                                <span className="flex items-center">
                                    📄 Your CV/Resume
                                    <span className="ml-2 px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">Required</span>
                                </span>
                            </label>
                            
                            {/* CV Input Mode Toggle */}
                            <div className="flex space-x-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setUploadMode("text")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        uploadMode === "text" 
                                            ? "bg-violet-600 text-white shadow-lg" 
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                >
                                    📝 Paste CV Text
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUploadMode("file")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        uploadMode === "file" 
                                            ? "bg-violet-600 text-white shadow-lg" 
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                >
                                    📎 Upload PDF CV
                                </button>
                            </div>

                            {/* CV Input Area */}
                            {uploadMode === "text" ? (
                                <textarea
                                    value={myCVText}
                                    onChange={(e) => setMyCVText(e.target.value)}
                                    placeholder="Paste your CV/resume content here... Include your skills, experience, education, and key achievements."
                                    rows={10}
                                    className="w-full p-4 bg-gray-700/50 text-white rounded-xl border border-gray-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-200 resize-none backdrop-blur-sm"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {/* File Upload Drop Zone */}
                                    <div 
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                            dragActive 
                                                ? 'border-violet-400 bg-violet-900/20' 
                                                : 'border-gray-600 bg-gray-800/50 hover:border-violet-500 hover:bg-gray-700/50'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <div className="space-y-3">
                                            <div className="mx-auto w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <div>
                                                <label htmlFor="cv-file-upload" className="cursor-pointer">
                                                    <span className="text-violet-400 hover:text-violet-300 font-medium">Click to upload</span>
                                                    <span className="text-gray-400"> or drag and drop your PDF CV here</span>
                                                </label>
                                                <input
                                                    id="cv-file-upload"
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleFileChange}
                                                    className="sr-only"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500">PDF files only (Max 10MB)</p>
                                        </div>
                                    </div>
                                    
                                    {cvFile && (
                                        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600/50">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-200">{cvFile.name}</p>
                                                    <p className="text-xs text-gray-400">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setCvFile(null)}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-violet-500/25 transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    <span>Analyze Job Match</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {analysisResult && (
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                            <span className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 text-sm">🤖</span>
                            AI Analysis Results
                        </h2>

                        {analysisResult.error ? (
                            <div className="bg-red-900/20 border border-red-600/50 p-6 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">❌</span>
                                    <div>
                                        <h3 className="text-red-400 font-semibold">Analysis Error</h3>
                                        <p className="text-red-300">{analysisResult.error}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Match Score */}
                                {analysisResult.match_score !== undefined && (
                                    <div className={`p-6 rounded-xl border backdrop-blur-sm ${getMatchScoreBg(analysisResult.match_score)}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-3xl">{getScoreEmoji(analysisResult.match_score)}</span>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white">Match Score</h3>
                                                    <p className="text-gray-400 text-sm">How well your CV aligns with the job</p>
                                                </div>
                                            </div>
                                            <div className={`text-5xl font-bold ${getMatchScoreColor(analysisResult.match_score)}`}>
                                                {analysisResult.match_score}%
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Strengths */}
                                {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                                    <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 p-6 rounded-xl backdrop-blur-sm">
                                        <h3 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center">
                                            <span className="mr-3 text-2xl">✅</span>
                                            Your Strengths
                                        </h3>
                                        <div className="space-y-3">
                                            {analysisResult.strengths.map((strength, index) => (
                                                <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-500/5 rounded-lg">
                                                    <span className="text-emerald-400 mt-1">•</span>
                                                    <p className="text-gray-300 leading-relaxed">{strength}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Missing Skills */}
                                {analysisResult.missing_skills && analysisResult.missing_skills.length > 0 && (
                                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 rounded-xl backdrop-blur-sm">
                                        <h3 className="text-xl font-semibold text-amber-400 mb-4 flex items-center">
                                            <span className="mr-3 text-2xl">⚠️</span>
                                            Skills to Improve
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {analysisResult.missing_skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-amber-600/20 text-amber-300 rounded-full text-sm border border-amber-600/30 font-medium backdrop-blur-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Summary */}
                                {analysisResult.summary && (
                                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-6 rounded-xl backdrop-blur-sm">
                                        <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                                            <span className="mr-3 text-2xl">📝</span>
                                            Summary & Recommendations
                                        </h3>
                                        <div className="bg-blue-500/5 p-4 rounded-lg">
                                            <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-gray-800/90 border border-gray-700/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <div className="animate-spin w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg">🤖</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-white font-semibold mb-1">Analyzing Your Profile</h3>
                                    <p className="text-gray-400 text-sm">This may take a few seconds...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobAnalyzer;