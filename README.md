

# Rayeva – AI Systems Assignment


[![](https://img.shields.io/badge/Live_App-Click_Here-brightgreen)](https://rayeva-ai-ten.vercel.app/)


---

# Implemented Modules



The following modules were implemented:

### Module 1 — AI Auto Category & Tag Generator

Automatically assigns product categories and sustainability metadata using AI.

**Features**

• Auto-detect primary category
• Suggest sub-category
• Generate SEO tags
• Suggest sustainability filters
• Store structured JSON in database

**Example Input**

```
Premium corporate gift set including bamboo pen, recycled notebook and stainless steel bottle.
```

**Example Output**

```json
{
  "primary_category": "Corporate Gifts",
  "sub_category": "Sustainable Office Supplies",
  "seo_tags": [
    "eco friendly corporate gifts",
    "bamboo stationery",
    "sustainable office supplies"
  ],
  "sustainability_filters": [
    "plastic-free",
    "recycled",
    "eco-friendly"
  ]
}
```

---

# Module 2 — AI B2B Proposal Generator

Generates **sustainable product recommendations within a given budget**.

**Features**

• Suggested product mix
• Budget allocation
• Cost breakdown
• Impact positioning summary
• Structured JSON output

**Example Input**

```
Budget: 50000
Event: Corporate Annual Conference
Preference: 100% sustainable
```

**Example Output**

```json
{
  "recommended_products": [
    {
      "name": "Bamboo Pen",
      "quantity": 200,
      "unit_price": 40,
      "total_price": 8000
    },
    {
      "name": "Recycled Notebook",
      "quantity": 150,
      "unit_price": 120,
      "total_price": 18000
    },
    {
      "name": "Organic Cotton Tote Bag",
      "quantity": 100,
      "unit_price": 150,
      "total_price": 15000
    }
  ],
  "total_budget_used": 41000,
  "remaining_budget": 9000,
  "impact_positioning": "This proposal promotes eco-friendly corporate gifting while reducing plastic waste."
}
```

---

# Architecture for Remaining Modules

## Module 3 — AI Impact Reporting Generator

This module estimates the **environmental impact of sustainable purchases**.

**Features**

• Estimate plastic saved
• Estimate carbon avoided
• Local sourcing summary
• Human-readable sustainability report

**Architecture**

```
Order Data
   │
   ▼
Impact Calculation Logic
   │
   ▼
AI Impact Report Generator
   │
   ▼
ImpactReport Database
```

**Logic Example**

```
plastic_saved = quantity × plastic_factor
carbon_saved = quantity × carbon_factor
```

**Example Output**

```json
{
  "plastic_saved_grams": 500,
  "carbon_avoided_grams": 2000,
  "local_sourcing_impact": "Products sourced from local eco manufacturers.",
  "impact_statement": "This order prevented 0.5 kg of plastic waste and reduced carbon emissions by 2 kg."
}
```

---

# Module 4 — AI WhatsApp Support Bot

An AI chatbot that helps customers with order-related queries.

**Features**

• Answer order status questions
• Handle return policy queries
• Escalate refund issues to human support
• Log AI conversations

**Architecture**

```
WhatsApp User
     │
     ▼
Webhook API
     │
     ▼
Support Controller
     │
 ┌─────────────┐
 │ Database    │
 │ Order Data  │
 └─────────────┘
     │
     ▼
AI Response Generator
     │
     ▼
User Reply
```

**Example Query**

```
Where is my order #123?
```

**AI Response**

```
Your order has been shipped and is expected to arrive on 10 December.
```

---

# System Architecture

```
Frontend (React)
        │
        ▼
Node.js + Express API
        │
        ├ Module 1 — Category Generator
        ├ Module 2 — Proposal Generator
        ├ Module 3 — Impact Reporting
        └ Module 4 — WhatsApp Support Bot
        │
        ▼
MongoDB Database
        │
        ▼
Groq LLM API
```

---

# AI Prompt Design Strategy

Prompts are designed using **structured prompting** to ensure predictable outputs.

Prompt structure:

```
Role Definition
Task Instruction
Input Variables
Output JSON Schema
Strict Rules
```

Example prompt:

```
You are a procurement AI for sustainable commerce.

Generate a structured proposal.

Budget: ₹50000
Event: Corporate Conference

Return JSON only.
```

This ensures:

• Structured responses
• Machine-readable JSON
• Reduced hallucination

---

# Database Schema

Main collections used in MongoDB:

### Product

```
name
description
ai_category_data
prompt_used
ai_response_raw
```

### Proposal

```
budget
event_type
proposal_data
prompt_used
ai_response_raw
```

### AI Log

```
module
prompt
response
timestamp
```

---

# Technical Stack

Frontend

• React
• Axios

Backend

• Node.js
• Express.js

AI

• Groq API
• LLaMA 3.1 model

Database

• MongoDB
• Mongoose

---

# Environment Variables

Create a `.env` file.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

---

# Project Folder Structure

```
rayeva-ai
│
├ backend
│   ├ controllers
│   ├ models
│   ├ services
│   ├ routes
│   └ server.js
│
├ frontend
│   └ src
│       └ App.js
│
├ README.md
└ .env.example
```

---

# Error Handling Strategy

The backend includes strong validation:

• Input validation
• AI response validation
• JSON parsing fallback
• Budget constraint enforcement

Example

```
if (total_budget > budget)
   trim products
```

---



# Key Learning Outcomes

This project demonstrates:

• AI integration with real business workflows
• Prompt engineering for structured outputs
• AI + backend logic separation
• Production-ready architecture

---




