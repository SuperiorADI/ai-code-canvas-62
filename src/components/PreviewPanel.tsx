import { useEffect, useRef, useState } from 'react';
import { FileNode, findFileByPath } from '@/lib/fileSystem';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewPanelProps {
  fileSystem: FileNode;
  refreshKey: number;
}

export function PreviewPanel({ fileSystem, refreshKey }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      updatePreview();
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [fileSystem, refreshKey]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    // Find the main HTML file
    const htmlFile = findFileByPath(fileSystem, '/src/index.html');
    
    if (!htmlFile || !htmlFile.content) {
      // Show default message if no HTML file
      const defaultHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 20px;
              }
              h1 { font-size: 2.5rem; margin-bottom: 1rem; }
              p { font-size: 1.2rem; opacity: 0.9; }
            </style>
          </head>
          <body>
            <div>
              <h1>🚀 Ready to Build</h1>
              <p>Generate your project using the AI assistant</p>
            </div>
          </body>
        </html>
      `;
      
      const blob = new Blob([defaultHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      return;
    }

    // Create a blob URL with the HTML content
    const blob = new Blob([htmlFile.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">Preview</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updatePreview()}
          className="gap-2"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </Button>
      </div>
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0 bg-white"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
