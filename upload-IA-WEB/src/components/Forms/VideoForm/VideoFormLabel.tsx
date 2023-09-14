import { LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export default function VideoFormLabel({ children, className, htmlFor }: LabelHTMLAttributes<HTMLLabelElement>) {
	return (
		<label
			htmlFor={htmlFor}
			className={twMerge(
				'flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm  hover:cursor-pointer hover:bg-primary/5',
				className,
			)}
		>
			{children}
		</label>
	);
}
