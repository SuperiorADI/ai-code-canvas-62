import { Terminal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface ConsoleMessage {
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
}

interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

export function ConsolePanel({ messages, onClear }: ConsolePanelProps) {
  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'success':
        return '✓';
      default:
        return '•';
    }
  };

  return (
    <div className="h-full flex flex-col panel-bg border-t border-border">
      <div className="px-4 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Console</h3>
          <span className="text-xs text-muted-foreground">
            ({messages.length} {messages.length === 1 ? 'message' : 'messages'})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="gap-2"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2 font-mono text-xs">
          {messages.length === 0 ? (
            <div className="text-muted-foreground italic py-4 text-center">
              Console is empty. Logs will appear here.
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-muted-foreground">
                  [{msg.timestamp.toLocaleTimeString()}]
                </span>
                <span className={getMessageColor(msg.type)}>
                  {getMessageIcon(msg.type)}
                </span>
                <span className={getMessageColor(msg.type)}>{msg.message}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
