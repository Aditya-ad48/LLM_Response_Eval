import os
import warnings
from dotenv import load_dotenv
from huggingface_hub import login
from flask import request, jsonify

# Move imports and initializations to the top level of the module
from judges.judge1_instruction_follower import get_instruction_following_score
from judges.judge2_hallucination import check_hallucination
from judges.judge3_coherence import get_coherence_score, initialize_gemini

# Load environment variables and initialize Gemini once
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
initialize_gemini(api_key)

warnings.filterwarnings("ignore")
hf_token = os.getenv("HF_TOKEN")
if hf_token:
    print("Logging into Hugging Face Hub using token from environment...")
    login(token=hf_token)
    print("Login successful.")
else:
    print("No Hugging Face token found in environment. Skipping login.")

def evaluate_agent_response(prompt: str, response: str):
    """
    The master function that runs the full evaluation pipeline.
    """
    instruction_score = get_instruction_following_score(prompt, response)
    nli_verdict, is_hallucination = check_hallucination(response)
    coherence_score = get_coherence_score(prompt, response)

    report = {
        "instruction_score_J1": round(instruction_score, 4) if instruction_score is not None else "N/A",
        "coherence_score_J3": round(coherence_score, 4),
        "is_hallucination_J2": is_hallucination,
        "nli_prediction_J2": nli_verdict
    }
    return report

def evaluate_json_data():
    """
    Flask view function that takes JSON data from the request, evaluates it, and returns the results as JSON.
    """
    json_data = request.get_json()
    if not json_data or not isinstance(json_data, list):
        return jsonify({"error": "Invalid input: expected a list of objects"}), 400
    
    results = []
    for item in json_data:
        if 'prompt' in item and 'response' in item:
            report = evaluate_agent_response(item['prompt'], item['response'])
            results.append({**item, **report})
        else:
            print(f"Skipping item due to missing 'prompt' or 'response': {item}")
    
    return jsonify(results)