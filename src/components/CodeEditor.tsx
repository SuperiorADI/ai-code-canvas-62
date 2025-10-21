import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FileNode } from '@/lib/fileSystem';

interface CodeEditorProps {
  file: FileNode | null;
  onContentChange: (path: string, content: string) => void;
  theme: 'light' | 'dark';
}

export function CodeEditor({ file, onContentChange, theme }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && file) {
      editorRef.current.setValue(file.content || '');
    }
  }, [file?.path]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleChange = (value: string | undefined) => {
    if (file && value !== undefined) {
      onContentChange(file.path, value);
    }
  };

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  if (!file) {
    return (
      <div className="h-full editor-bg flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No file selected</p>
          <p className="text-xs mt-1">Select a file from the explorer to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="bg-card border-b border-border px-4 py-2 flex items-center gap-2">
        <span className="text-sm font-medium">{file.name}</span>
        <span className="text-xs text-muted-foreground">{file.path}</span>
      </div>
      <Editor
        height="calc(100% - 41px)"
        language={getLanguage(file.name)}
        value={file.content || ''}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          folding: true,
        }}
      />
    </div>
  );
}
