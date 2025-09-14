import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, PieChart as PieIcon } from 'lucide-react';
import { EvaluationData, AgentMetrics } from '@/types/evaluation';

interface HallucinationChartProps {
  data: EvaluationData[];
  agentMetrics: AgentMetrics[];
}

export function HallucinationChart({ data, agentMetrics }: HallucinationChartProps) {
  const hallucinationData = agentMetrics.map(agent => ({
    agent: agent.agent_id,
    percentage: agent.hallucination_rate * 100,
    count: Math.round(agent.total_responses * agent.hallucination_rate),
    total: agent.total_responses,
  }));

  const nliData = [
    {
      name: 'Entailment',
      value: data.filter(d => d.nli_prediction === 'entailment').length,
      color: 'hsl(var(--chart-4))'
    },
    {
      name: 'Contradiction',
      value: data.filter(d => d.nli_prediction === 'contradiction').length,
      color: 'hsl(var(--destructive))'
    },
    {
      name: 'Neutral',
      value: data.filter(d => d.nli_prediction === 'neutral').length,
      color: 'hsl(var(--chart-3))'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Hallucination Rate by Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hallucinationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="agent" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  label={{ value: 'Hallucination %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(1)}% (${props.payload.count}/${props.payload.total})`,
                    'Hallucination Rate'
                  ]}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="hsl(var(--destructive))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-chart-3" />
            NLI Prediction Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nliData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nliData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number) => [value, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}