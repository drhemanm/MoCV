import React, { useRef, useEffect } from 'react';

interface LTRInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  type?: 'input' | 'textarea';
}

const LTRInput: React.FC<LTRInputProps> = ({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  className = '',
  type = 'textarea'
}) => {
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const element = inputRef.current;
      
      // Force LTR at the DOM level
      element.dir = 'ltr';
      element.style.direction = 'ltr';
      element.style.textAlign = 'left';
      element.style.unicodeBidi = 'embed';
      element.style.writingMode = 'horizontal-tb';
      
      // Force reflow
      element.offsetHeight;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Ensure the cursor position is maintained
    const cursorPosition = e.target.selectionStart;
    
    onChange(newValue);
    
    // Restore cursor position after React re-render
    setTimeout(() => {
      if (inputRef.current && cursorPosition !== null) {
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const baseStyle = {
    direction: 'ltr' as const,
    textAlign: 'left' as const,
    unicodeBidi: 'embed' as const,
    writingMode: 'horizontal-tb' as const,
    fontFamily: 'inherit',
    fontSize: 'inherit'
  };

  if (type === 'textarea') {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        dir="ltr"
        className={className}
        style={baseStyle}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      dir="ltr"
      className={className}
      style={baseStyle}
    />
  );
};

export default LTRInput;