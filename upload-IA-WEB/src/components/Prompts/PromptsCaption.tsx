import { HTMLAttributes } from 'react';

export interface PromptsCaptionProps extends HTMLAttributes<HTMLSpanElement> {}

export default function PromptsCaption({ children }: PromptsCaptionProps) {
	return <span className="text-sm text-muted-foreground">{children}</span>;
}
