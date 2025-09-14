import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp as ScatterIcon } from 'lucide-react';
import { EvaluationData } from '@/types/evaluation';

interface ScatterChartProps {
  data: EvaluationData[];
}

export function ScatterChart({ data }: ScatterChartProps) {
  const agents = Array.from(new Set(data.map(d => d.agent_id)));
  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  
  const scatterData = agents.map((agent, index) => ({
    agent,
    data: data
      .filter(d => d.agent_id === agent)
      .map(d => ({
        x: d.coherence_score,
        y: d.instruction_score,
        agent: d.agent_id,
        prompt: d.prompt.substring(0, 50) + '...',
      })),
    color: colors[index % colors.length]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScatterIcon className="h-5 w-5 text-chart-3" />
          Coherence vs Instruction Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Coherence Score" 
                domain={[0, 5]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Instruction Score" 
                domain={[0, 5]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.agent}</p>
                        <p className="text-sm text-muted-foreground">{data.prompt}</p>
                        <p className="text-sm">Coherence: {data.x?.toFixed(2)}</p>
                        <p className="text-sm">Instruction: {data.y?.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {scatterData.map((agentData, index) => (
                <Scatter
                  key={agentData.agent}
                  name={agentData.agent}
                  data={agentData.data}
                  fill={agentData.color}
                />
              ))}
            </RechartsScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}