import { useState } from 'react';
import { Filter, Users, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterState } from '@/types/evaluation';

interface SidebarProps {
  agents: string[];
  prompts: { id: string; text: string }[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function Sidebar({ agents, prompts, filters, onFiltersChange }: SidebarProps) {
  const [agentsOpen, setAgentsOpen] = useState(true);
  const [promptsOpen, setPromptsOpen] = useState(false);

  const handleAgentToggle = (agentId: string) => {
    const newSelectedAgents = filters.selectedAgents.includes(agentId)
      ? filters.selectedAgents.filter(id => id !== agentId)
      : [...filters.selectedAgents, agentId];
    
    onFiltersChange({
      ...filters,
      selectedAgents: newSelectedAgents,
    });
  };

  const handlePromptToggle = (promptId: string) => {
    const newSelectedPrompts = filters.selectedPrompts.includes(promptId)
      ? filters.selectedPrompts.filter(id => id !== promptId)
      : [...filters.selectedPrompts, promptId];
    
    onFiltersChange({
      ...filters,
      selectedPrompts: newSelectedPrompts,
    });
  };

  const selectAllAgents = () => {
    onFiltersChange({
      ...filters,
      selectedAgents: agents,
    });
  };

  const clearAllAgents = () => {
    onFiltersChange({
      ...filters,
      selectedAgents: [],
    });
  };

  const selectAllPrompts = () => {
    onFiltersChange({
      ...filters,
      selectedPrompts: prompts.map(p => p.id),
    });
  };

  const clearAllPrompts = () => {
    onFiltersChange({
      ...filters,
      selectedPrompts: [],
    });
  };

  if (agents.length === 0) {
    return (
      <div className="w-80 border-r bg-dashboard-sidebar p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-5 w-5" />
              <span>Upload data to see filters</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-dashboard-sidebar p-4 space-y-4">
      <div className="flex items-center gap-2 px-2">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Filters</h2>
      </div>

      <Card>
        <Collapsible open={agentsOpen} onOpenChange={setAgentsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Agents ({filters.selectedAgents.length}/{agents.length})
                </div>
                {agentsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="flex gap-2 mb-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllAgents}
                  className="flex-1 text-xs"
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllAgents}
                  className="flex-1 text-xs"
                >
                  None
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {agents.map((agent) => (
                  <div key={agent} className="flex items-center space-x-2">
                    <Checkbox
                      id={`agent-${agent}`}
                      checked={filters.selectedAgents.includes(agent)}
                      onCheckedChange={() => handleAgentToggle(agent)}
                    />
                    <label
                      htmlFor={`agent-${agent}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {agent}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card>
        <Collapsible open={promptsOpen} onOpenChange={setPromptsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Prompts ({filters.selectedPrompts.length}/{prompts.length})
                </div>
                {promptsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="flex gap-2 mb-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllPrompts}
                  className="flex-1 text-xs"
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllPrompts}
                  className="flex-1 text-xs"
                >
                  None
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`prompt-${prompt.id}`}
                      checked={filters.selectedPrompts.includes(prompt.id)}
                      onCheckedChange={() => handlePromptToggle(prompt.id)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`prompt-${prompt.id}`}
                      className="text-xs leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {prompt.text.substring(0, 60)}...
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}