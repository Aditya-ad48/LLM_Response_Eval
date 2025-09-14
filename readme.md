# ⚡ EvalDash – LLM Evaluation Analytics  
[![Build Passing](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/yourorg/yourrepo) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Made with Flask/React](https://img.shields.io/badge/Made%20with-Flask%20%26%20React-blue.svg)](https://github.com)

EvalDash is a **full-stack platform** for evaluating and analyzing Large Language Model (LLM) responses.  
It combines a **modern React (TypeScript) dashboard frontend** with a **Flask (Python) backend**, enabling **multi-judge automated evaluation** (instruction following, hallucination detection, coherence scoring) on bulk LLM outputs.

---

## 📝 Abstract  

EvalDash provides a **robust, extensible framework** for automated evaluation of LLM responses.  
It integrates **traditional NLP models** (DistilBERT, DeBERTa) with **modern APIs** (Gemini) and **web search** to deliver **multi-dimensional quality metrics**.  
The **interactive dashboard** lets researchers and practitioners **upload, analyze, and compare** LLM outputs at scale.

---

## ✨ Key Features  

- 🔍 **Automated Multi-Judge Evaluation** – Instruction following, hallucination detection, and coherence scoring.  
- 📊 **Interactive Dashboard** – Visualize results, filter by agent/model, prompt, or metric.  
- 📂 **Bulk File Upload** – Supports **JSON, CSV, and DOCX** formats.  
- 🌐 **RESTful API** – Simple integration with other tools and pipelines.  
- 🎨 **Modern UI** – Responsive, themeable, and mobile-friendly.  
- 🔗 **CORS Ready** – Works seamlessly across local or remote setups.

## 🏗️ Architecture

**Frontend (React/TypeScript):**  
Communicates with the backend via HTTP/JSON.

**Backend (Flask/Python):**  
Handles API requests and orchestrates evaluations.

**Judge System:**  
- **DistilBERT:** Instruction evaluation  
- **DeBERTa:** NLI and hallucination detection  
- **Gemini API:** Coherence scoring  
- **Web Search (DDGS):** Supplementary data gathering

## 🚀 Getting Started  

### ✅ Prerequisites  

- **Backend:** Python `3.8+`, pip, HuggingFace account, Gemini API key  
- **Frontend:** Node.js `16+`, npm or yarn

---

### 📥 Installation  

#### 1️⃣ Clone the Repository  
```bash
git clone <repository-url>
cd E6
```

#### 2️⃣ Backend Setup

```bash
cd backend
python -m venv myenv
source myenv/bin/activate   # On Windows: myenv\Scripts\activate

pip install flask flask-cors flask-session python-dotenv
pip install transformers sentence-transformers torch
pip install google-generativeai huggingface-hub
pip install sentencepiece tiktoken ddgs
pip install pandas tqdm docx2txt
```

Create `.env` file:

```bash
cat > .env << EOF
HF_TOKEN=your_huggingface_token_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URI=http://localhost:8080
EOF
```

#### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:

```bash
cat > .env << EOF
VITE_BACKEND_URL=http://127.0.0.1:5000/api
EOF
```

---

## 🎯 Usage

### ▶ Start Backend

```bash
cd backend
source myenv/bin/activate
python app.py
```

👉 Runs at **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

### ▶ Start Frontend

```bash
cd frontend
npm run dev
```

👉 Runs at **[http://localhost:8080](http://localhost:8080)**

---

### 📤 Upload Data

Prepare a file (`JSON/CSV/DOCX`) in this format:

```json
[
  {
    "prompt_id": "p001",
    "prompt": "Write a short poem about technology",
    "response": "Digital dreams flow through silicon streams...",
    "agent_id": "gpt-4"
  }
]
```

Go to the dashboard → **Upload File** → **View Results** ✅

---

## 📚 API Documentation

### 🔹 POST `/api/evaluate/`

**Request**

```json
[
  {
    "prompt_id": "string",
    "prompt": "string",
    "response": "string",
    "agent_id": "string"
  }
]
```

**Response**

```json
[
  {
    "prompt_id": "string",
    "prompt": "string",
    "response": "string",
    "agent_id": "string",
    "instruction_score": 0.8542,
    "coherence_score": 3.7234,
    "is_hallucination": false,
    "nli_prediction": "entailment"
  }
]
```

---

## 🧪 Evaluation Judges

* 🧭 **Judge 1: Instruction Following** → DistilBERT classifier (score: `0–1`).
* 🚨 **Judge 2: Hallucination Detection** → DeBERTa NLI + Cross-Encoder + Web Search → returns **boolean** + **NLI label**.
* 🔗 **Judge 3: Coherence Scoring** → Local transformer + Gemini API (score: `1–5`).

---

## 📁 Project Structure

```
E6/
├── backend/
│   ├── controllers/
│   ├── judges/
│   ├── routes/
│   ├── app.py
│   └── config.py
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## ⚙️ Configuration

### 🔹 Backend `.env`

* `HF_TOKEN` → HuggingFace token  
* `GEMINI_API_KEY` → Gemini API key  
* `CLIENT_URI` → Frontend URL  

### 🔹 Frontend `.env`

* `VITE_BACKEND_URL` → Backend API base URL

---

## 🆘 Troubleshooting

* ❌ **Judge 2 not loading** → `pip install sentencepiece tiktoken`
* 🌐 **CORS errors** → Ensure `CLIENT_URI` matches frontend URL.
* 🔑 **Model access/auth** → Check `HF_TOKEN` validity.
* 💾 **Memory issues** → Use smaller models for testing.

---

## 🤝 Contributing

1. Fork the repo 🍴  
2. Create a **feature branch** 🌱  
3. Commit & push 🔼  
4. Open a **Pull Request** 📬

---

## 📝 License

Licensed under **MIT License** – see `LICENSE`.

Built with ❤️ for the **LLM evaluation community** 🚀
