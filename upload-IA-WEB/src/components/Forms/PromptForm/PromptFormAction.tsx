import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export default function PromptFormAction({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={twMerge('space-y-2', className)} {...rest}>
			{children}
		</div>
	);
}
