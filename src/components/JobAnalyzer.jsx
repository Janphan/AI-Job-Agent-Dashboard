import React, { useState } from 'react';

const JobAnalyzer = () => {
    const [url, setUrl] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setCvFile(file);
        } else {
            alert('Please select a PDF file');
            e.target.value = '';
        }
    };

    const handleAnalyze = async () => {
        if (!url.trim() || !cvFile) {
            alert('Please provide both job URL and CV PDF file');
            return;
        }

        // 1. Loading state
        setLoading(true);

        try {
            // Create FormData for PDF upload
            const formData = new FormData();
            formData.append('jd_text', url);
            formData.append('cv_file', cvFile);

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/analyze-pdf`, {
                method: 'POST',
                body: formData // Don't set Content-Type, let browser set it with boundary
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // 2. Update state with real analysis data
            setAnalysisResult(result);
        } catch (error) {
            console.error("Backend connection error:", error);
            alert('Error connecting to backend: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">🤖 AI Job Analyzer</h1>

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
                                Upload Your CV/Resume (PDF)
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-violet-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                            {cvFile && (
                                <p className="text-sm text-gray-400 mt-2">
                                    Selected: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                            {loading ? 'Analyzing PDF...' : 'Analyze Job Match'}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {analysisResult && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-white mb-4">🎯 AI Analysis Results</h2>

                        {analysisResult.error ? (
                            <div className="bg-red-900/20 border border-red-600 p-4 rounded-lg">
                                <p className="text-red-400">Error: {analysisResult.error}</p>
                            </div>
                        ) : (
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
                                <span className="text-white">Analyzing PDF and job compatibility...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobAnalyzer;