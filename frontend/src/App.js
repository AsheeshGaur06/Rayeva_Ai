import React, { useState } from "react";
import axios from "axios";

/*
=================================================
  BASE API CONFIG (Environment Ready)
=================================================
*/

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {

  /*
  =================================================
  MODULE 1 STATES
  =================================================
  */

  const [description, setDescription] = useState("");
  const [categoryResult, setCategoryResult] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  /*
  =================================================
  MODULE 2 STATES
  =================================================
  */

  const [budget, setBudget] = useState("");
  const [eventType, setEventType] = useState("");
  const [proposalResult, setProposalResult] = useState(null);
  const [proposalLoading, setProposalLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  /*
  =================================================
  MODULE 1 - CATEGORY GENERATION
  =================================================
  */

const generateCategory = async () => {

  if (!description.trim()) {
    setErrorMessage("Please enter product description");
    return;
  }

  try {

    setErrorMessage("");
    setCategoryLoading(true);

    const res = await axios.post(`${API}/api/category`, {
      name: "Sample Product",
      description
    });

    if (res.data?.data?.ai_category_data) {
      setCategoryResult(res.data.data.ai_category_data);
    } else {
      console.log("API RESPONSE:", res.data);
      throw new Error("Invalid category response");
    }

  } catch (error) {

    console.error("Category Error:", error);

    setErrorMessage(
      error.response?.data?.message ||
      "Category generation failed"
    );

  } finally {
    setCategoryLoading(false);
  }
};

  /*
  =================================================
  MODULE 2 - PROPOSAL GENERATION
  =================================================
  */

  const generateProposal = async () => {

    if (!budget || !eventType) {
      setErrorMessage("Budget and Event Type are required");
      return;
    }

    try {

      setErrorMessage("");
      setProposalLoading(true);

      const res = await axios.post(
        `${API}/api/proposal`,
        {
          budget: Number(budget),
          event: eventType,
          preference: "100% sustainable"
        }
      );

      if (res.data?.proposal?.proposal_data) {
        setProposalResult(res.data.proposal.proposal_data);
      } else {
        throw new Error("Invalid proposal response");
      }

    } catch (error) {

      console.error("Proposal Error:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Proposal generation failed"
      );

    } finally {
      setProposalLoading(false);
    }
  };

  /*
  =================================================
  RESET FUNCTION (Better UX)
  =================================================
  */

  const resetAll = () => {
    setDescription("");
    setCategoryResult(null);
    setBudget("");
    setEventType("");
    setProposalResult(null);
    setErrorMessage("");
  };

  /*
  =================================================
  UI
  =================================================
  */

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>

      <h2>🌱 Module 1 - AI Category Generator</h2>

      <textarea
        rows="5"
        cols="60"
        placeholder="Enter product description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={categoryLoading}
      />

      <br />

      <button
        onClick={generateCategory}
        disabled={categoryLoading}
      >
        {categoryLoading ? "Generating..." : "Generate Category"}
      </button>

      {categoryResult && (
        <pre style={{ background: "#f4f4f4", padding: 10 }}>
          {JSON.stringify(categoryResult, null, 2)}
        </pre>
      )}

      <hr />

      <h2>💼 Module 2 - AI Proposal Generator</h2>

      <input
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        disabled={proposalLoading}
      />

      <br /><br />

      <input
        placeholder="Event Type"
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        disabled={proposalLoading}
      />

      <br /><br />

      <button
        onClick={generateProposal}
        disabled={proposalLoading}
      >
        {proposalLoading ? "Generating..." : "Generate Proposal"}
      </button>

      {proposalResult && (
        <pre style={{ background: "#f4f4f4", padding: 10 }}>
          {JSON.stringify(proposalResult, null, 2)}
        </pre>
      )}

      {errorMessage && (
        <div style={{ color: "red", marginTop: 20 }}>
          ❌ {errorMessage}
        </div>
      )}

      <br />

      <button onClick={resetAll}>
        Reset All
      </button>

    </div>
  );
}

export default App;