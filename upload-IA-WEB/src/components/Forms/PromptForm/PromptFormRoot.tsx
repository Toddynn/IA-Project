import { FormHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export default function PromptFormRoot({ className, onSubmit, children, ...rest }: FormHTMLAttributes<HTMLFormElement>) {
	return (
		<form onSubmit={onSubmit} className={twMerge('space-y-6 ', className)} {...rest}>
			{children}
		</form>
	);
}
