import { Code2, Download, Play, Save, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onDownload: () => void;
  onRunPreview: () => void;
  onSave: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Header({ onDownload, onRunPreview, onSave, theme, onThemeToggle }: HeaderProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    onDownload();
    toast({
      title: 'Download started',
      description: 'Your project is being downloaded as a ZIP file.',
    });
  };

  const handleSave = () => {
    onSave();
    toast({
      title: 'Progress saved',
      description: 'Your changes have been saved to browser storage.',
    });
  };

  return (
    <header className="border-b border-border bg-card h-14 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Code2 className="w-6 h-6 text-primary" />
        <h1 className="text-lg font-bold">AI Coding Studio</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Save Progress
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRunPreview}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          Run Preview
        </Button>
        
        <Button
          size="sm"
          onClick={handleDownload}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download Project
        </Button>
      </div>
    </header>
  );
}
