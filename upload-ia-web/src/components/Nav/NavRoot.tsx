import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface NavRootProps extends HTMLAttributes<HTMLElement> {}

export default function NavRoot({ children, className, ...rest }: NavRootProps) {
	return (
		<nav className={twMerge('flex w-full items-center justify-between border-b px-6 py-3 ', className)} {...rest}>
			{children}
		</nav>
	);
}
