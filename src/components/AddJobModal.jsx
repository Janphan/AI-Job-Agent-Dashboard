import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AddJobModal = ({ cvText, onCvTextChange, onClose, onJobAdded }) => {
    const [url, setUrl] = useState('');
    const [localCvText, setLocalCvText] = useState(cvText || '');
    const [cvFile, setCvFile] = useState(null);
    const [uploadMode, setUploadMode] = useState('text');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [pdfUploading, setPdfUploading] = useState(false);

    const handleAnalyze = async () => {
        if (!url.trim()) {
            alert('Please paste a job URL');
            return;
        }

        const finalCv = uploadMode === 'file' ? localCvText : localCvText;
        if (!finalCv.trim()) {
            alert('Please provide your CV (paste text or upload PDF)');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jd_text: url.trim(),
                    cv_text: finalCv.trim(),
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Analysis failed: ${err}`);
            }

            const data = await response.json();
            onCvTextChange(finalCv.trim());
            onJobAdded({ ...data, url: url.trim() });
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPdfUploading(true);

        const form = new FormData();
        form.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/extract_pdf`, {
                method: 'POST',
                body: form,
            });
            if (!res.ok) throw new Error('PDF upload failed');
            const data = await res.json();
            setLocalCvText(data.text || '');
            setCvFile(file);
        } catch (err) {
            alert(err.message);
        } finally {
            setPdfUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setCvFile(file);
                handleFileChange({ target: { files: [file] } });
            } else {
                alert('Please select a PDF file');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface-modal border border-border-default rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-text-heading flex items-center">
                        <span className="w-8 h-8 bg-interactive-primary rounded-lg flex items-center justify-center mr-3 text-sm">📋</span>
                        Add Custom Job
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-muted hover:text-text-heading hover:bg-interactive-ghost-hover rounded-lg transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-body">
                            <span className="flex items-center">
                                🔗 Job URL
                                <span className="ml-2 px-2 py-0.5 bg-interactive-primary-muted text-interactive-primary text-xs rounded-full">Required</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://linkedin.com/jobs/..."
                            className="w-full p-3 bg-surface-input text-text-heading rounded-xl border border-border-default focus:border-border-active focus:ring-2 focus:ring-focus-ring focus:outline-none transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-body">
                            <span className="flex items-center">
                                📄 Your CV/Resume
                                <span className="ml-2 px-2 py-0.5 bg-interactive-primary-muted text-interactive-primary text-xs rounded-full">Required</span>
                            </span>
                        </label>

                        <div className="flex space-x-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setUploadMode('text')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${uploadMode === 'text' ? 'bg-interactive-primary text-text-heading shadow-lg' : 'bg-surface-input text-text-body hover:bg-surface-elevated'}`}
                            >
                                📝 Paste CV Text
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('file')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${uploadMode === 'file' ? 'bg-interactive-primary text-text-heading shadow-lg' : 'bg-surface-input text-text-body hover:bg-surface-elevated'}`}
                            >
                                📎 Upload PDF CV
                            </button>
                        </div>

                        {uploadMode === 'text' ? (
                            <textarea
                                value={localCvText}
                                onChange={(e) => setLocalCvText(e.target.value)}
                                placeholder="Paste your CV/resume content here..."
                                rows={6}
                                className="w-full p-3 bg-surface-input text-text-heading rounded-xl border border-border-default focus:border-border-active focus:ring-2 focus:ring-focus-ring focus:outline-none transition-all duration-200 resize-none"
                            />
                        ) : (
                            <div
                                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${dragActive ? 'border-border-active bg-interactive-primary-muted' : 'border-border-default bg-surface-input hover:border-border-active hover:bg-surface-card-hover'}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="space-y-3">
                                    <div className="mx-auto w-14 h-14 bg-interactive-primary-muted rounded-full flex items-center justify-center">
                                        <svg className="w-7 h-7 text-interactive-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <label htmlFor="modal-cv-upload" className="cursor-pointer">
                                            <span className="text-interactive-primary hover:text-interactive-primary-hover font-medium">Click to upload</span>
                                            <span className="text-text-muted"> or drag and drop</span>
                                        </label>
                                        <input
                                            id="modal-cv-upload"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="sr-only"
                                        />
                                    </div>
                                    <p className="text-xs text-text-placeholder">PDF files only</p>
                                </div>
                            </div>
                        )}

                        {pdfUploading && (
                            <div className="flex items-center space-x-2 p-3 bg-status-info-bg border border-status-info-border rounded-xl">
                                <div className="animate-spin w-4 h-4 border-2 border-status-info/30 border-t-status-info rounded-full" />
                                <span className="text-status-info text-sm">Processing PDF...</span>
                            </div>
                        )}

                        {cvFile && !pdfUploading && (
                            <div className="flex items-center justify-between p-3 bg-surface-input rounded-xl border border-border-default">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-status-error" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-text-heading">{cvFile.name}</span>
                                </div>
                                <button onClick={() => setCvFile(null)} className="text-text-muted hover:text-status-error">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-interactive-primary to-purple-600 hover:from-interactive-primary-hover hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-text-heading rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-interactive-primary/25 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin w-5 h-5 border-2 border-text-heading/30 border-t-text-heading rounded-full" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <span>🔍</span>
                                <span>Analyze Job</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddJobModal;
