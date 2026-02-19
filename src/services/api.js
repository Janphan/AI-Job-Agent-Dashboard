const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const analyzeJobWithPDF = async (jdText, pdfFile) => {
    try {
        const formData = new FormData();
        formData.append('jd_text', jdText);
        formData.append('cv_file', pdfFile);

        const response = await fetch(`${API_BASE_URL}/analyze-pdf`, {
            method: 'POST',
            body: formData // Don't set Content-Type header, let browser set it for FormData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const analyzeJob = async (jdText, cvText) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jd_text: jdText,
                cv_text: cvText
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};