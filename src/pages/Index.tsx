import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChatPanel } from '@/components/ChatPanel';
import { MainPanel } from '@/components/MainPanel';
import { ConsolePanel, ConsoleMessage } from '@/components/ConsolePanel';
import { LoadingScreen } from '@/components/LoadingScreen';
import { FileNode, defaultFileSystem, updateFileContent } from '@/lib/fileSystem';
import { generateProject } from '@/lib/aiService';
import { downloadProject } from '@/lib/downloadHelper';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [fileSystem, setFileSystem] = useState<FileNode>(defaultFileSystem);
  const [messages, setMessages] = useState<Message[]>([]);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [apiKey, setApiKey] = useState('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');
  const { toast } = useToast();

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Load saved API key
    const savedKey = localStorage.getItem('claude_api_key');
    if (savedKey) setApiKey(savedKey);
    
    // Load saved file system
    const savedFS = localStorage.getItem('fileSystem');
    if (savedFS) {
      try {
        setFileSystem(JSON.parse(savedFS));
      } catch (e) {
        console.error('Failed to load saved file system', e);
      }
    }

    addConsoleMessage('info', 'AI Coding Studio initialized');
  }, []);

  useEffect(() => {
    // Save API key
    if (apiKey) {
      localStorage.setItem('claude_api_key', apiKey);
    }
  }, [apiKey]);

  const addConsoleMessage = (type: ConsoleMessage['type'], message: string) => {
    setConsoleMessages(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const handleSendMessage = async (message: string) => {
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Claude API key to continue.',
        variant: 'destructive',
      });
      return;
    }

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);
    addConsoleMessage('info', `User: ${message}`);

    try {
      const response = await generateProject(message, apiKey);
      addConsoleMessage('success', 'AI response received');
      
      // Try to parse the JSON response
      try {
        const parsed = JSON.parse(response);
        
        if (parsed.files && Array.isArray(parsed.files)) {
          // Update file system with generated files
          let newFS = { ...fileSystem };
          
          parsed.files.forEach((file: { path: string; content: string }) => {
            addConsoleMessage('info', `Creating file: ${file.path}`);
            newFS = updateFileContent(newFS, file.path, file.content);
          });
          
          setFileSystem(newFS);
          setRefreshKey(prev => prev + 1);
          
          const assistantMessage: Message = {
            role: 'assistant',
            content: parsed.description || 'Project generated successfully! Check the preview and code tabs.',
          };
          setMessages(prev => [...prev, assistantMessage]);
          addConsoleMessage('success', 'Project generated successfully');
          
          toast({
            title: 'Project Generated',
            description: 'Your project has been created. Check the preview!',
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        // If JSON parsing fails, treat it as a regular message
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
        };
        setMessages(prev => [...prev, assistantMessage]);
        addConsoleMessage('warning', 'Received text response instead of project files');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addConsoleMessage('error', `Generation failed: ${errorMessage}`);
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileContentChange = (path: string, content: string) => {
    setFileSystem(prev => updateFileContent(prev, path, content));
    addConsoleMessage('info', `File modified: ${path}`);
  };

  const handleDownload = () => {
    downloadProject(fileSystem, 'ai-generated-project');
    addConsoleMessage('success', 'Project downloaded');
  };

  const handleRunPreview = () => {
    setRefreshKey(prev => prev + 1);
    addConsoleMessage('info', 'Preview refreshed');
    toast({
      title: 'Preview Updated',
      description: 'The preview has been refreshed with your latest changes.',
    });
  };

  const handleSave = () => {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
    addConsoleMessage('success', 'Progress saved to browser storage');
  };

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleClearConsole = () => {
    setConsoleMessages([]);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        onDownload={handleDownload}
        onRunPreview={handleRunPreview}
        onSave={handleSave}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0 h-full overflow-hidden">
          <ChatPanel
            onSendMessage={handleSendMessage}
            messages={messages}
            isLoading={isGenerating}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <MainPanel
              fileSystem={fileSystem}
              onFileContentChange={handleFileContentChange}
              refreshKey={refreshKey}
              theme={theme}
            />
          </div>
          
          <div className="h-48 flex-shrink-0">
            <ConsolePanel
              messages={consoleMessages}
              onClear={handleClearConsole}
            />
          </div>
        </div>
      </div>

      {isGenerating && <LoadingScreen message="Generating your project..." />}
    </div>
  );
};

export default Index;
