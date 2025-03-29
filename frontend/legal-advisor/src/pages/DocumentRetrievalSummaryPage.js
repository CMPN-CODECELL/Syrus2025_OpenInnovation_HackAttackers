import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "./DocumentRetrievalSummaryPage.css";

const API_KEY = "AIzaSyAMrKz2dIHwDHCE330nLPXrxMUn-FA74gc";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DocumentRetrievalSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doc = location.state?.doc;

  const [pdfText, setPdfText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doc) {
      navigate("/"); 
      return;
    }
    fetchDocumentContent();
  }, [doc, navigate]);

  const fetchDocumentContent = async () => {
    try {
      const response = await axios.get(doc.url, { responseType: "arraybuffer" });
      const typedArray = new Uint8Array(response.data);

      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item) => item.str).join(" ");
        extractedText += ` ${text}`;
      }

      setPdfText(extractedText);
      summarizeDocument(extractedText);
    } catch (error) {
      console.error("Error extracting PDF text:", error);
    }
  };

  const summarizeDocument = async (text) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: `Summarize this legal document: ${text}` }]
            }
          ]
        }
      );

      const summaryText =
        response.data?.candidates[0]?.content?.parts[0]?.text || "No summary available.";

      setSummary(summaryText);
    } catch (error) {
      console.error("Error summarizing document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-container">
      <h2>📄 Document Summary</h2>
      <p><strong>Document Name:</strong> {doc?.name}</p>
      <p><strong>Category:</strong> {doc?.category}</p>

      {loading ? (
        <p>🔍 Summarizing document... ⏳</p>
      ) : (
        <div className="summary-box">
          <h3>🔍 Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      <div className="actions">
        <button className="go-back-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};

export default DocumentRetrievalSummaryPage;
