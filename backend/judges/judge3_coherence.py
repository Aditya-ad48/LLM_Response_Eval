import numpy as np
from sentence_transformers import SentenceTransformer, util
from transformers import AutoTokenizer, AutoModelForCausalLM
import google.generativeai as genai
import torch
import time

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
lm_tokenizer = AutoTokenizer.from_pretrained("distilgpt2")
lm_model = AutoModelForCausalLM.from_pretrained("distilgpt2")
gemini_client = None
print("judges-3 local models loaded.")


def initialize_gemini(api_key):
    global gemini_client
    if "YOUR_GEMINI_API_KEY" in api_key or not api_key:
        print(" judges-3 WARNING: Gemini API key not set. 'llm_score' will be skipped.")
        gemini_client = None
    else:
        genai.configure(api_key=api_key)
        gemini_client = genai.GenerativeModel('gemini-1.5-flash')
        print(" judges-3 Gemini client initialized.")


def get_llm_score(response_text):
    if gemini_client is None: return None
    prompt = "Score the coherence of the following text on a scale from 1 to 5. Respond with only a single number."
    for attempt in range(3):
        try:
            response = gemini_client.generate_content(prompt + "\n\n" + response_text)
            return float(response.text)
        except Exception as e:
            if "429" in str(e):
                time.sleep(2 ** attempt)
            else:
                break
    return None


def get_coherence_score(prompt, response):

    llm_score_raw = get_llm_score(response)
    prompt_sim = util.cos_sim(embedding_model.encode(prompt), embedding_model.encode(response)).item()
    adj_sim = 0.5
    sentences = [s.strip() for s in response.split('.') if s.strip()]
    if len(sentences) >= 2:
        embeddings = embedding_model.encode(sentences)
        sims = [util.cos_sim(embeddings[i], embeddings[i + 1]).item() for i in range(len(embeddings) - 1)]
        if sims: adj_sim = np.mean(sims)

    perplexity = 10000.0
    if response.strip():
        inputs = lm_tokenizer(response, return_tensors="pt")
        with torch.no_grad():
            outputs = lm_model(**inputs, labels=inputs["input_ids"])
            perplexity = torch.exp(outputs.loss).item()


    normalized_perplexity = max(0, 1 - (min(perplexity, 1000) / 1000))
    normalized_llm_score = (llm_score_raw - 1) / 4 if llm_score_raw is not None else None


    weights = {
        'llm': 0.4,
        'prompt_sim': 0.3,
        'perplexity': 0.2,
        'adj_sim': 0.1
    }


    active_scores = {
        'prompt_sim': prompt_sim,
        'perplexity': normalized_perplexity,
        'adj_sim': adj_sim
    }

    if normalized_llm_score is not None:
        active_scores['llm'] = normalized_llm_score
    else:

        del weights['llm']


    total_weight = sum(weights.values())
    normalized_weights = {k: v / total_weight for k, v in weights.items()}


    final_score = sum(active_scores[k] * normalized_weights[k] for k in active_scores)

    return 1 + (final_score * 4)
