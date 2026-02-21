import React, { useState } from "react";
import { analyzeJob, uploadCV, analyzeJobWithPDF } from "../services/api";

const JobInput = ({ onAddJob }) => {
    const [jdText, setJdText] = useState(""); // URL or raw JD
    const [cvText, setCvText] = useState(""); // user's CV text
    const [cvFile, setCvFile] = useState(null); // uploaded PDF file
    const [uploadMode, setUploadMode] = useState("text"); // "text" or "file"
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!jdText.trim()) {
            alert("Please provide a job URL or job text.");
            return;
        }

        if (uploadMode === "text" && !cvText.trim()) {
            alert("Please provide your CV text.");
            return;
        }

        if (uploadMode === "file" && !cvFile) {
            alert("Please upload a PDF CV file.");
            return;
        }

        setLoading(true);
        try {
            let result;
            if (uploadMode === "text") {
                result = await analyzeJob(jdText, cvText);
            } else {
                result = await analyzeJobWithPDF(jdText, cvFile);
            }
            
            const analysisText = result.analysis || JSON.stringify(result);
            onAddJob({
                title: jdText, // could be replaced with parsed title if scraper returns one later
                url: jdText,
                description: jdText,
                analysis: analysisText,
            });
            setJdText("");
            setCvText("");
            setCvFile(null);
        } catch (err) {
            alert("Analysis failed: " + (err.message || JSON.stringify(err)));
        } finally {
            setLoading(false);
        }
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

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste job URL or full job text here"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm"
            />
            
            {/* CV Input Mode Toggle */}
            <div className="flex space-x-2 mb-3">
                <button
                    type="button"
                    onClick={() => setUploadMode("text")}
                    className={`px-3 py-1 rounded text-sm ${
                        uploadMode === "text" 
                            ? "bg-violet-600 text-white" 
                            : "bg-gray-600 text-gray-300"
                    }`}
                >
                    Paste CV Text
                </button>
                <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`px-3 py-1 rounded text-sm ${
                        uploadMode === "file" 
                            ? "bg-violet-600 text-white" 
                            : "bg-gray-600 text-gray-300"
                    }`}
                >
                    Upload PDF CV
                </button>
            </div>

            {/* CV Input Area */}
            {uploadMode === "text" ? (
                <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Paste your CV/resume text here"
                    className="w-full h-24 p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm"
                />
            ) : (
                <div className="space-y-3">
                    {/* File Upload Drop Zone */}
                    <div 
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            dragActive 
                                ? 'border-violet-400 bg-violet-900/20' 
                                : 'border-gray-600 bg-gray-800 hover:border-violet-500'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-2">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-gray-300">
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <span className="text-violet-400 hover:text-violet-300">Click to upload</span>
                                    <span className="text-gray-400"> or drag and drop</span>
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                />
                            </div>
                            <p className="text-xs text-gray-500">PDF files only</p>
                        </div>
                    </div>
                    
                    {cvFile && (
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded border border-gray-600">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-200">{cvFile.name}</span>
                                <span className="text-xs text-gray-400">({(cvFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCvFile(null)}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded"
            >
                {loading ? "Analyzing..." : "Analyze Job URL / JD"}
            </button>
        </form>
    );
};

export default JobInput;