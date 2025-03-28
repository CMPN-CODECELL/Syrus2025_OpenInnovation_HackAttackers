// REACT //
import React, { useState } from "react";

// STYLES //
import "./CaseTrackingPage.css";

const casesData = [
  {
    id: 1,
    title: "Property Dispute",
    status: "Ongoing",
    history: ["Filed on Jan 10", "Hearing on Feb 5", "Next hearing on Mar 12"],
  },
  {
    id: 2,
    title: "Divorce Settlement",
    status: "Closed",
    history: ["Filed on Mar 3", "Hearing on Apr 15", "Finalized on May 20"],
  },
  {
    id: 3,
    title: "Domestic Violence",
    status: "Ongoing",
    history: ["Filed on Jun 1", "Hearing on Jul 8", "Next hearing on Aug 16"],
  },
];

const CaseTrackingPage = () => {
  const [selectedCase, setSelectedCase] = useState(null);

  return (
    <div className="case-tracking-container">
      <h1>Case Tracking</h1>
      <div className="case-list">
        {casesData.map((c) => (
          <div
            key={c.id}
            className="case-card"
            onClick={() => setSelectedCase(c)}
          >
            <h3>{c.title}</h3>
            <p>
              Status:{" "}
              <span className={`status ${c.status.toLowerCase()}`}>
                {c.status}
              </span>
            </p>
          </div>
        ))}
      </div>

      {selectedCase && (
        <div className="case-history">
          <h2>Case History: {selectedCase.title}</h2>
          <ul>
            {selectedCase.history.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedCase(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CaseTrackingPage;
