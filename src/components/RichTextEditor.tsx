import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Type, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Convert plain text to HTML with basic formatting
  const textToHtml = (text: string): string => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  };

  // Convert HTML back to plain text with markdown-like formatting
  const htmlToText = (html: string): string => {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<ul><li>(.*?)<\/li><\/ul>/gi, '• $1')
      .replace(/<li>(.*?)<\/li>/gi, '• $1')
      .replace(/<[^>]*>/g, '');
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const textContent = e.currentTarget.textContent || '';
    onChange(textContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleFormat('redo');
          } else {
            handleFormat('undo');
          }
          break;
      }
    }

    // Auto-create bullet points
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const text = container.textContent || '';
        
        if (text.trim().startsWith('•')) {
          e.preventDefault();
          document.execCommand('insertHTML', false, '<br>• ');
        }
      }
    }
  };

  // Update editor content when value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.textContent !== value) {
      editorRef.current.textContent = value;
    }
  }, [value]);

  return (
    <div className={`border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => handleFormat('undo')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('redo')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </button>
        
        <div className="ml-auto text-xs text-gray-500">
          Use • for bullets, **bold**, *italic*
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          className="p-3 min-h-24 focus:outline-none"
          style={{ 
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'embed',
            whiteSpace: 'pre-wrap'
          }}
          suppressContentEditableWarning={true}
        >
          {value}
        </div>

        {/* Placeholder */}
        {!value && !isEditing && (
          <div 
            className="absolute top-3 left-3 text-gray-400 pointer-events-none"
            style={{ direction: 'ltr', textAlign: 'left' }}
          >
            {placeholder}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="px-3 pb-2 text-xs text-gray-500">
        <strong>Formatting tips:</strong> Use • for bullet points, **text** for bold, *text* for italic
      </div>
    </div>
  );
};

export default RichTextEditor;