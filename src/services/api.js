const API_BASE_URL = 'http://127.0.0.1:8000';

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

export const uploadCV = async (file) => {
    try {
        const formData = new FormData();
        formData.append('cv_file', file);

        const response = await fetch(`${API_BASE_URL}/upload-cv`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('CV Upload Error:', error);
        throw error;
    }
};

export const analyzeJobWithPDF = async (jdText, cvFile) => {
    try {
        const formData = new FormData();
        formData.append('jd_text', jdText);
        formData.append('cv_file', cvFile);

        const response = await fetch(`${API_BASE_URL}/analyze-with-pdf`, {
            method: 'POST',
            body: formData
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