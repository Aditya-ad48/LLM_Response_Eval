import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { AgentMetrics } from '@/types/evaluation';

interface LeaderboardChartProps {
  data: AgentMetrics[];
}

export function LeaderboardChart({ data }: LeaderboardChartProps) {
  const chartData = data
    .sort((a, b) => b.composite_score - a.composite_score)
    .map((agent, index) => ({
      ...agent,
      rank: index + 1,
      hallucination_percentage: (agent.hallucination_rate * 100).toFixed(1),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-chart-1" />
          Agent Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="agent_id" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'composite_score' ? value.toFixed(2) : 
                  name === 'hallucination_rate' ? `${(value * 100).toFixed(1)}%` :
                  value.toFixed(2),
                  name === 'composite_score' ? 'Composite Score' :
                  name === 'avg_instruction_score' ? 'Avg Instruction Score' :
                  name === 'avg_coherence_score' ? 'Avg Coherence Score' :
                  name === 'hallucination_rate' ? 'Hallucination Rate' : name
                ]}
              />
              <Legend />
              <Bar 
                dataKey="composite_score" 
                name="Composite Score"
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="avg_instruction_score" 
                name="Instruction Score"
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="avg_coherence_score" 
                name="Coherence Score"
                fill="hsl(var(--chart-3))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}