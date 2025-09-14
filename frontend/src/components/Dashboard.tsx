import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { FileUpload } from '@/components/FileUpload';
import { LeaderboardChart } from '@/components/charts/LeaderboardChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { ScatterChart } from '@/components/charts/ScatterChart';
import { HallucinationChart } from '@/components/charts/HallucinationChart';
import { EvaluationData, FilterState } from '@/types/evaluation';
import { calculateAgentMetrics, calculatePromptMetrics, filterData } from '@/utils/dataProcessing';

export function Dashboard() {
  const [rawData, setRawData] = useState<EvaluationData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    selectedAgents: [],
    selectedPrompts: [],
  });

  const { agents, prompts, filteredData, agentMetrics, promptMetrics } = useMemo(() => {
    const agents = Array.from(new Set(rawData.map(d => d.agent_id))).sort();
    const prompts = Array.from(new Set(rawData.map(d => d.prompt_id)))
      .map(id => ({
        id,
        text: rawData.find(d => d.prompt_id === id)?.prompt || '',
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const filteredData = filterData(rawData, filters.selectedAgents, filters.selectedPrompts);
    const agentMetrics = calculateAgentMetrics(filteredData);
    const promptMetrics = calculatePromptMetrics(filteredData);

    return { agents, prompts, filteredData, agentMetrics, promptMetrics };
  }, [rawData, filters]);

  const handleDataUpload = async (data: EvaluationData[]) => {
    setIsUploading(true);
    try {
      setRawData(data);
      
      // Initialize filters to show all data
      const allAgents = Array.from(new Set(data.map(d => d.agent_id)));
      const allPrompts = Array.from(new Set(data.map(d => d.prompt_id)));
      
      setFilters({
        selectedAgents: allAgents,
        selectedPrompts: allPrompts,
      });
      
      setShowUploadDialog(false);
    } finally {
      setIsUploading(false);
    }
  };

  const hasData = rawData.length > 0;

  if (!hasData && !showUploadDialog) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Navbar 
          onUploadClick={() => setShowUploadDialog(true)} 
          hasData={hasData}
        />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Welcome to EvalDash
              </h1>
              <p className="text-xl text-muted-foreground">
                Professional LLM evaluation analytics platform
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Upload your evaluation data to get started with comprehensive analysis, 
                interactive visualizations, and detailed insights into your model performance.
              </p>
            </div>
            
            <FileUpload 
              onDataUpload={handleDataUpload} 
              isLoading={isUploading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Navbar 
        onUploadClick={() => setShowUploadDialog(true)} 
        hasData={hasData}
      />
      
      <div className="flex">
        <Sidebar
          agents={agents}
          prompts={prompts}
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">No data matches your filters</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your agent or prompt selections
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <LeaderboardChart data={agentMetrics} />
                <RadarChart data={agentMetrics} />
              </div>
              
              <HallucinationChart 
                data={filteredData} 
                agentMetrics={agentMetrics} 
              />
              
              <ScatterChart data={filteredData} />
              
              <div className="bg-dashboard-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Dataset Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">{filteredData.length}</p>
                    <p className="text-sm text-muted-foreground">Total Responses</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-chart-2">{agentMetrics.length}</p>
                    <p className="text-sm text-muted-foreground">Agents</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-chart-3">{prompts.length}</p>
                    <p className="text-sm text-muted-foreground">Prompts</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-destructive">
                      {(filteredData.filter(d => d.is_hallucination).length / filteredData.length * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Hallucination Rate</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Evaluation Data</DialogTitle>
            <DialogDescription>
              Upload a JSON file containing your LLM evaluation results
            </DialogDescription>
          </DialogHeader>
          <FileUpload 
            onDataUpload={handleDataUpload} 
            isLoading={isUploading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}