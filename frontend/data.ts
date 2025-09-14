const data = [
    {
        "response_id": "resp_001",
        "prompt_id": "p001",
        "agent_id": "o3mini-gpt-v1",
        "prompt": "Write a short, optimistic poem about the future of technology.",
        "response": "Bright circuits hum, new ideas take flight\u2014tomorrow's tools turning darkness into light.",
        "instruction_score": 3.8,
        "is_hallucination": false,
        "nli_prediction": "entailment",
        "coherence_score": 4.1
    },
    {
        "response_id": "resp_002",
        "prompt_id": "p002",
        "agent_id": "o3mini-gpt-v1",
        "prompt": "Explain the theory of relativity in simple terms.",
        "response": "Space and time are linked. Big objects bend the fabric of spacetime, which makes things move along curved paths.",
        "instruction_score": 2.2,
        "is_hallucination": false,
        "nli_prediction": "entailment",
        "coherence_score": 2.5
    },
    {
        "response_id": "resp_003",
        "prompt_id": "p003",
        "agent_id": "o3max-gpt-pro",
        "prompt": "What are the main causes of climate change?",
        "response": "Burning fossil fuels, deforestation, and industrial emissions increase greenhouse gases, trapping heat in the atmosphere.",
        "instruction_score": 4.5,
        "is_hallucination": false,
        "nli_prediction": "entailment",
        "coherence_score": 4.3
    },
    {
        "response_id": "resp_004",
        "prompt_id": "p004",
        "agent_id": "o3mini-gpt-v2",
        "prompt": "What's the best way to learn Python for data science?",
        "response": "Start with basics (syntax, data structures), practice with small projects, and learn libraries like pandas and scikit-learn.",
        "instruction_score": 3.0,
        "is_hallucination": false,
        "nli_prediction": "entailment",
        "coherence_score": 3.6
    },
    {
        "response_id": "resp_005",
        "prompt_id": "p005",
        "agent_id": "chronos-1",
        "prompt": "List steps to deploy a Docker container to production.",
        "response": "Build the image, push to a registry, configure orchestration (Kubernetes), set CI/CD and monitoring.",
        "instruction_score": 1.5,
        "is_hallucination": true,
        "nli_prediction": "neutral",
        "coherence_score": 0.8
    },
    {
        "response_id": "resp_006",
        "prompt_id": "p006",
        "agent_id": "o3mini-gpt-v1",
        "prompt": "Summarize the key idea of attention mechanisms in transformers.",
        "response": "Attention lets the model weigh different parts of the input when producing each output token, enabling context-aware representations.",
        "instruction_score": 4.0,
        "is_hallucination": false,
        "nli_prediction": "entailment",
        "coherence_score": 3.9
    },
    {
        "response_id": "resp_007",
        "prompt_id": "p007",
        "agent_id": "o3max-gpt-pro",
        "prompt": "Write an SQL query to get top 5 users by purchase amount.",
        "response": "SELECT user_id, SUM(amount) as total FROM purchases GROUP BY user_id ORDER BY total DESC LIMIT 5;",
        "instruction_score": 3.7,
        "is_hallucination": false,
        "nli_prediction": "entailment",
        "coherence_score": 3.4
    },
    {
        "response_id": "resp_008",
        "prompt_id": "p008",
        "agent_id": "chronos-1",
        "prompt": "Translate 'Hello, how are you?' to French.",
        "response": "Bonjour, comment \u00e7a va ?",
        "instruction_score": 2.9,
        "is_hallucination": false,
        "nli_prediction": "entailment",
        "coherence_score": 2.7
    }
];

export default data;