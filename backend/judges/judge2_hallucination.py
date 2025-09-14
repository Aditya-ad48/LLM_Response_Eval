from ddgs import DDGS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import CrossEncoder
import torch
import numpy as np

try:
    nli_tokenizer = AutoTokenizer.from_pretrained("MoritzLaurer/DeBERTa-v3-base-mnli")
    nli_model = AutoModelForSequenceClassification.from_pretrained("MoritzLaurer/DeBERTa-v3-base-mnli")
    cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    print(" judges-2 loaded successfully.")
except Exception as e:
    nli_model = None
    print(f" Could not load judges-2 models. Error: {e}")


def get_top_snippets(query, num_results=5):
    """
    Helper function to search the web and retrieve snippets.
    """
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=num_results))
        if not results:
            return []

        snippets = [r['body'] for r in results if 'body' in r and r['body']]
        return snippets
    except Exception as e:
        print(f"An error occurred during web search: {e}")
        return []


def check_hallucination(agent_claim):
    """
    Uses web search, a cross-encoder, and NLI to check for hallucinations.
    """
    if nli_model is None:
        print("judges-2 models are not loaded. Returning error.")
        return "ERROR: judges-2 not loaded", True

   # Retrieve multiple text snippets from the web
    all_snippets = get_top_snippets(agent_claim)
    if not all_snippets:
        return "COULD_NOT_RETRIEVE", True

    # Re-rank the snippets with the Cross-Encoder to find the best evidence
    sentence_pairs = [[agent_claim, snippet] for snippet in all_snippets]
    scores = cross_encoder.predict(sentence_pairs)

    # Select the snippet with the highest relevance score
    best_snippet = all_snippets[np.argmax(scores)]

    #  Verify the claim against the BEST snippet using the NLI model
    premise = best_snippet
    hypothesis = agent_claim

    input_tokens = nli_tokenizer(premise, hypothesis, truncation=True, return_tensors="pt")

    with torch.no_grad():
        outputs = nli_model(**input_tokens)
        predicted_class_id = outputs.logits.argmax().item()

    prediction = nli_model.config.id2label[predicted_class_id]
    is_hallucination = prediction != "entailment"

    return prediction, is_hallucination