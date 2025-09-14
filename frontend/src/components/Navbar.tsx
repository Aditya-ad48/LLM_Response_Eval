import { BarChart3, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavbarProps {
  onUploadClick: () => void;
  hasData: boolean;
}

export function Navbar({ onUploadClick, hasData }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                EvalDash
              </h1>
              <p className="text-xs text-muted-foreground">
                LLM Evaluation Analytics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant={hasData ? "outline" : "default"}
            size="sm" 
            onClick={onUploadClick}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {hasData ? 'Upload New' : 'Upload Data'}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}