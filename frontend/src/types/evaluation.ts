export interface InputData {
  prompt_id: string;
  prompt: string;
  response: string;
  agent_id: string;
}

export interface EvaluationData extends InputData {
  instruction_score: number; // J1 - added by backend
  is_hallucination: boolean; // J2 - added by backend
  nli_prediction: 'entailment' | 'contradiction' | 'neutral'; // added by backend
  coherence_score: number; // J3 - added by backend
}

export interface AgentMetrics {
  agent_id: string;
  avg_instruction_score: number;
  avg_coherence_score: number;
  hallucination_rate: number;
  total_responses: number;
  composite_score: number;
}

export interface PromptMetrics {
  prompt_id: string;
  prompt: string;
  avg_instruction_score: number;
  avg_coherence_score: number;
  hallucination_rate: number;
  total_responses: number;
}

export interface FilterState {
  selectedAgents: string[];
  selectedPrompts: string[];
}