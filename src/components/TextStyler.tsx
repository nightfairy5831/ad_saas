import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Eye, Paintbrush, Wand2
} from 'lucide-react';

interface TextStylerProps {
  value: string;
  styles?: string;
  onChange: (value: string, styles: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  characterLimit?: number;
  multiline?: boolean;
  rows?: number;
  showAISuggest?: boolean;
  onAISuggest?: () => void;
}

interface StyleState {
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  color: string;
  fontSize: string;
  textAlign: string;
}

export const TextStyler = ({
  value,
  styles = '',
  onChange,
  placeholder = '',
  className = '',
  label = '',
  characterLimit,
  multiline = false,
  rows = 3,
  showAISuggest = false,
  onAISuggest
}: TextStylerProps) => {
  const [showStyler, setShowStyler] = useState(false);

  // Parse existing styles
  const parseStyles = (styleString: string): StyleState => {
    const defaultStyles: StyleState = {
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#000000',
      fontSize: '16px',
      textAlign: 'left'
    };

    if (!styleString) return defaultStyles;

    const styles = styleString.split(';').reduce((acc, style) => {
      const [property, value] = style.split(':').map(s => s.trim());
      if (property && value) {
        acc[property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
      }
      return acc;
    }, {} as any);

    return { ...defaultStyles, ...styles };
  };

  const [styleState, setStyleState] = useState<StyleState>(() => parseStyles(styles));

  const updateStyle = (property: keyof StyleState, styleValue: string) => {
    const newStyleState = { ...styleState, [property]: styleValue };
    setStyleState(newStyleState);

    // Convert to CSS string
    const cssString = Object.entries(newStyleState)
      .filter(([_, value]) => value && value !== 'normal' && value !== 'none' && value !== 'left')
      .map(([property, value]) => {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssProperty}:${value}`;
      })
      .join(';');

    onChange(value, cssString);
  };

  const toggleBold = () => {
    updateStyle('fontWeight', styleState.fontWeight === 'bold' ? 'normal' : 'bold');
  };

  const toggleItalic = () => {
    updateStyle('fontStyle', styleState.fontStyle === 'italic' ? 'normal' : 'italic');
  };

  const toggleUnderline = () => {
    updateStyle('textDecoration', styleState.textDecoration === 'underline' ? 'none' : 'underline');
  };

  const setAlignment = (align: string) => {
    updateStyle('textAlign', align);
  };

  const previewStyle = {
    fontWeight: styleState.fontWeight,
    fontStyle: styleState.fontStyle,
    textDecoration: styleState.textDecoration,
    color: styleState.color,
    fontSize: styleState.fontSize,
    textAlign: styleState.textAlign as any
  };

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{label}</Label>
            <div className="flex items-center gap-2">
              <Popover open={showStyler} onOpenChange={setShowStyler}>
                <Tooltip>
                  <TooltipTrigger>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Paintbrush className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Style your text</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Text Styling</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowStyler(false)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Style Controls */}
                    <div className="space-y-3">
                      {/* Bold, Italic, Underline */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Text Style</Label>
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant={styleState.fontWeight === 'bold' ? 'default' : 'outline'}
                                size="sm"
                                onClick={toggleBold}
                                className="h-8 w-8 p-0"
                              >
                                <Bold className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Make text bold</p></TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant={styleState.fontStyle === 'italic' ? 'default' : 'outline'}
                                size="sm"
                                onClick={toggleItalic}
                                className="h-8 w-8 p-0"
                              >
                                <Italic className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Make text italic</p></TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant={styleState.textDecoration === 'underline' ? 'default' : 'outline'}
                                size="sm"
                                onClick={toggleUnderline}
                                className="h-8 w-8 p-0"
                              >
                                <Underline className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Underline text</p></TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Text Alignment */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Text Alignment</Label>
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant={styleState.textAlign === 'left' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setAlignment('left')}
                                className="h-8 w-8 p-0"
                              >
                                <AlignLeft className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Align text to the left</p></TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant={styleState.textAlign === 'center' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setAlignment('center')}
                                className="h-8 w-8 p-0"
                              >
                                <AlignCenter className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Center text</p></TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant={styleState.textAlign === 'right' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setAlignment('right')}
                                className="h-8 w-8 p-0"
                              >
                                <AlignRight className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Align text to the right</p></TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Color Picker */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Text Color</Label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={styleState.color}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="w-8 h-8 rounded border border-border cursor-pointer"
                          />
                          <Input
                            value={styleState.color}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            placeholder="#000000"
                            className="text-xs font-mono flex-1"
                          />
                        </div>
                      </div>

                      {/* Font Size */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Font Size</Label>
                        <div className="flex gap-2">
                          <Input
                            value={styleState.fontSize.replace('px', '')}
                            onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                            type="number"
                            min="8"
                            max="72"
                            className="text-xs w-20"
                          />
                          <span className="text-xs text-muted-foreground self-center">px</span>
                        </div>
                      </div>

                      {/* Preview */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
                        <div
                          className="p-3 border border-border rounded bg-background"
                          style={previewStyle}
                        >
                          {value || placeholder || 'Sample text'}
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {showAISuggest && onAISuggest && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAISuggest}
                  className="text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  AI Suggest
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="relative">
          {multiline ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value, styles)}
              placeholder={placeholder}
              className={`${className} pr-10`}
              style={previewStyle}
              rows={rows}
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value, styles)}
              placeholder={placeholder}
              className={`${className} pr-10`}
              style={previewStyle}
            />
          )}
          {styles && (
            <div className="absolute right-2 top-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
          )}
        </div>

        {characterLimit && (
          <p className="text-xs text-muted-foreground">
            Character count: {value.length}/{characterLimit}
          </p>
        )}
      </div>
    </TooltipProvider>
  );
};