import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { PreviewPanel } from './PreviewPanel';
import { FileNode, findFileByPath } from '@/lib/fileSystem';
import { Code2, Monitor } from 'lucide-react';

interface MainPanelProps {
  fileSystem: FileNode;
  onFileContentChange: (path: string, content: string) => void;
  refreshKey: number;
  theme: 'light' | 'dark';
}

export function MainPanel({ fileSystem, onFileContentChange, refreshKey, theme }: MainPanelProps) {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const selectedFile = selectedFilePath ? findFileByPath(fileSystem, selectedFilePath) : null;

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'code')} className="h-full flex flex-col">
        <div className="border-b border-border bg-card px-4 flex-shrink-0">
          <TabsList className="h-12">
            <TabsTrigger value="preview" className="gap-2">
              <Monitor className="w-4 h-4" />
              UI Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code2 className="w-4 h-4" />
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="flex-1 m-0 data-[state=active]:flex flex-col">
          <PreviewPanel fileSystem={fileSystem} refreshKey={refreshKey} />
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 m-0 data-[state=active]:flex">
          <div className="flex-1 flex h-full">
            <div className="w-64 flex-shrink-0">
              <FileExplorer
                fileSystem={fileSystem}
                selectedFile={selectedFilePath}
                onFileSelect={setSelectedFilePath}
              />
            </div>
            <div className="flex-1">
              <CodeEditor
                file={selectedFile}
                onContentChange={onFileContentChange}
                theme={theme}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
