import React, { useState } from "react";
import { analyzeJob } from "../services/api";

const JobInput = ({ onAddJob }) => {
    const [jdText, setJdText] = useState(""); // URL or raw JD
    const [cvText, setCvText] = useState(""); // user's CV text
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jdText.trim() || !cvText.trim()) {
            alert("Please provide a job URL/text and your CV text.");
            return;
        }

        setLoading(true);
        try {
            const result = await analyzeJob(jdText, cvText); // backend handles URL scraping or raw JD
            const analysisText = result.analysis || JSON.stringify(result);
            onAddJob({
                title: jdText, // could be replaced with parsed title if scraper returns one later
                url: jdText,
                description: jdText,
                analysis: analysisText,
            });
            setJdText("");
            setCvText("");
        } catch (err) {
            alert("Analysis failed: " + (err.message || JSON.stringify(err)));
        } finally {
            setLoading(false);
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
            <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV/resume text here"
                className="w-full h-24 p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm"
            />
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