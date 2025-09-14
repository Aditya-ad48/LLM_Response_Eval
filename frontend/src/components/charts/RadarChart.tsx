import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { AgentMetrics } from '@/types/evaluation';

interface RadarChartProps {
  data: AgentMetrics[];
}

export function RadarChart({ data }: RadarChartProps) {
  // Take top 5 agents by composite score
  const topAgents = data
    .sort((a, b) => b.composite_score - a.composite_score)
    .slice(0, 5);

  const metrics = ['instruction_score', 'coherence_score', 'reliability'];
  
  const radarData = metrics.map(metric => {
    const entry: any = { metric: metric.replace('_', ' ').toUpperCase() };
    
    topAgents.forEach(agent => {
      if (metric === 'instruction_score') {
        entry[agent.agent_id] = agent.avg_instruction_score;
      } else if (metric === 'coherence_score') {
        entry[agent.agent_id] = agent.avg_coherence_score;
      } else if (metric === 'reliability') {
        entry[agent.agent_id] = (1 - agent.hallucination_rate) * 5; // Scale to 0-5
      }
    });
    
    return entry;
  });

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-chart-2" />
          Top Agents Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 5]} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickCount={6}
              />
              {topAgents.map((agent, index) => (
                <Radar
                  key={agent.agent_id}
                  name={agent.agent_id}
                  dataKey={agent.agent_id}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                formatter={(value: number) => [value.toFixed(2), '']}
              />
              <Legend />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}