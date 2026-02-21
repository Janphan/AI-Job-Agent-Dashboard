import fitz  # PyMuPDF
import re

def extract_text_from_pdf(pdf_path):
    """
    Extract text content from a PDF file using PyMuPDF.
    """
    text = ""
    try:
        # Open PDF file
        doc = fitz.open(pdf_path)
        
        # Extract text from each page
        for page in doc:
            text += page.get_text() + "\n"
        
        # Close the document
        doc.close()
        
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
    return clean_text(text)

def clean_text(text):
    """
    Clean and normalize text content.
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?@()-]', '', text)
    
    return text.strip()