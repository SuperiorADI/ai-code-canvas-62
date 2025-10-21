import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { FileNode } from '@/lib/fileSystem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileExplorerProps {
  fileSystem: FileNode;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

function TreeNode({ node, level, selectedFile, onFileSelect }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.path);
    }
  };

  const paddingLeft = `${level * 12 + 8}px`;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer hover-bg transition-colors ${
          isSelected ? 'active-bg' : ''
        }`}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        {node.type === 'folder' ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-primary" />
          ) : (
            <Folder className="w-4 h-4 text-primary" />
          )
        ) : (
          <File className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={`${child.path}-${index}`}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ fileSystem, selectedFile, onFileSelect }: FileExplorerProps) {
  return (
    <div className="h-full flex flex-col border-r border-border sidebar-bg">
      <div className="p-3 border-b border-border flex-shrink-0">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">Explorer</h3>
      </div>
      <ScrollArea className="flex-1">
        <TreeNode
          node={fileSystem}
          level={0}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
        />
      </ScrollArea>
    </div>
  );
}
