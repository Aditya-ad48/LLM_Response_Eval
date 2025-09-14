import { EvaluationData, AgentMetrics, PromptMetrics } from '@/types/evaluation';

export function calculateAgentMetrics(data: EvaluationData[]): AgentMetrics[] {
  const agentGroups = data.reduce((acc, item) => {
    if (!acc[item.agent_id]) {
      acc[item.agent_id] = [];
    }
    acc[item.agent_id].push(item);
    return acc;
  }, {} as Record<string, EvaluationData[]>);

  return Object.entries(agentGroups).map(([agentId, items]) => {
    const totalResponses = items.length;
    const avgInstructionScore = items.reduce((sum, item) => sum + item.instruction_score, 0) / totalResponses;
    const avgCoherenceScore = items.reduce((sum, item) => sum + item.coherence_score, 0) / totalResponses;
    const hallucinationCount = items.filter(item => item.is_hallucination).length;
    const hallucinationRate = hallucinationCount / totalResponses;

    // Calculate composite score
    const normalizedInstruction = avgInstructionScore / 5; // Assuming max score is 5
    const normalizedCoherence = avgCoherenceScore / 5;
    const hallucinationPenalty = hallucinationRate * 0.5; // 50% penalty for hallucinations
    
    const compositeScore = (normalizedInstruction + normalizedCoherence - hallucinationPenalty) * 5;

    return {
      agent_id: agentId,
      avg_instruction_score: avgInstructionScore,
      avg_coherence_score: avgCoherenceScore,
      hallucination_rate: hallucinationRate,
      total_responses: totalResponses,
      composite_score: Math.max(0, compositeScore), // Ensure non-negative
    };
  });
}

export function calculatePromptMetrics(data: EvaluationData[]): PromptMetrics[] {
  const promptGroups = data.reduce((acc, item) => {
    if (!acc[item.prompt_id]) {
      acc[item.prompt_id] = [];
    }
    acc[item.prompt_id].push(item);
    return acc;
  }, {} as Record<string, EvaluationData[]>);

  return Object.entries(promptGroups).map(([promptId, items]) => {
    const totalResponses = items.length;
    const avgInstructionScore = items.reduce((sum, item) => sum + item.instruction_score, 0) / totalResponses;
    const avgCoherenceScore = items.reduce((sum, item) => sum + item.coherence_score, 0) / totalResponses;
    const hallucinationCount = items.filter(item => item.is_hallucination).length;
    const hallucinationRate = hallucinationCount / totalResponses;

    return {
      prompt_id: promptId,
      prompt: items[0].prompt, // Assuming same prompt_id has same prompt text
      avg_instruction_score: avgInstructionScore,
      avg_coherence_score: avgCoherenceScore,
      hallucination_rate: hallucinationRate,
      total_responses: totalResponses,
    };
  });
}

export function filterData(
  data: EvaluationData[], 
  selectedAgents: string[], 
  selectedPrompts: string[]
): EvaluationData[] {
  return data.filter(item => {
    const agentMatch = selectedAgents.length === 0 || selectedAgents.includes(item.agent_id);
    const promptMatch = selectedPrompts.length === 0 || selectedPrompts.includes(item.prompt_id);
    return agentMatch && promptMatch;
  });
}