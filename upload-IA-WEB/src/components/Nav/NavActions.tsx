import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface NavActionsProps extends HTMLAttributes<HTMLElement> {}

export default function NavActions({ children, className, ...rest }: NavActionsProps) {
	return (
		<div className={twMerge('flex items-center gap-3', className)} {...rest}>
			{children}
		</div>
	);
}
