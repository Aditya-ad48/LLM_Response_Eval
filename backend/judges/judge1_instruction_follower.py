from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch



HUB_MODEL_NAME = "aditya1310/instruction-judge"

print(f"Initializing judges-1 from Hub: {HUB_MODEL_NAME}")
try:
    # Load the tokenizer and model from your repository on the Hub
    tokenizer = AutoTokenizer.from_pretrained(HUB_MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(HUB_MODEL_NAME)
    print(" judges-1 loaded successfully from the Hub.")
except Exception as e:
    model = None
    print(f"️ Could not load judges-1 from the Hub. Please check the model name.")


def get_instruction_following_score(prompt, response):
    """
    Uses your fine-tuned model to score how well a response follows a prompt.
    """
    if model is None:
        print("judges-1 model is not loaded. Returning None.")
        return None

    # Format the input exactly as it was during training
    text_to_score = "Question: " + prompt + "\n\nAnswer: " + response

    inputs = tokenizer(text_to_score, return_tensors="pt", truncation=True, max_length=512)

    with torch.no_grad():
        # The model outputs a single number (a logit) which is our score
        score = model(**inputs).logits[0].item()

    return score