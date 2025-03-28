import React, { useState, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "./DocumentSummariserPage.css";

const API_KEY = "AIzaSyAMrKz2dIHwDHCE330nLPXrxMUn-FA74gc";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DocumentSummariserPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPdfPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPdfPreviewUrl(null);
    setSummary("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);

        try {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let extractedText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const text = content.items.map((item) => item.str).join(" ");
            extractedText += ` ${text}`;
          }

          resolve(extractedText);
        } catch (error) {
          console.error("Error extracting text from PDF:", error);
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };


  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const extractedText = await extractTextFromPDF(selectedFile);
      console.log("Extracted PDF Text:", extractedText);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: `Summarize this legal document: ${extractedText}` }]
            }
          ]
        }
      );

      const summaryText =
        response.data?.candidates[0]?.content?.parts[0]?.text ||
        "No summary available.";

      setSummary(summaryText);
    } catch (error) {
      console.error("Error summarizing the document:", error);
      alert("❌ Failed to summarize the document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-summary-container">
      <div className="doc-summary-card">
        <h2>📄 Document Summariser</h2>
        <p>Upload a legal document (PDF) to generate a summary.</p>

        {/* File Upload */}
        <div className="button-group">
          <label className="file-upload">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <span>📂 Choose a File</span>
          </label>

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Summarizing..." : "📤 Upload & Summarize"}
          </button>
        </div>

        {/* PDF Preview */}
        {selectedFile && (
          <div className="file-preview">
            <div className="pdf-preview-container">
              <iframe
                src={pdfPreviewUrl}
                title="PDF Preview"
                className="pdf-preview"
              ></iframe>
              <button className="close-btn" onClick={removeFile}>
                ✖
              </button>
            </div>
            <p className="file-name">✅ {selectedFile.name}</p>
          </div>
        )}

        {/* Summary Box */}
        {summary && (
          <div className="summary-box">
            <h3>🔍 Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSummariserPage;
