import { RootCombinedProps } from '@/interfaces';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export default function PromptsRoot({ className, children, ...rest }: RootCombinedProps) {
	return (
		<motion.div className={twMerge('flex flex-1 flex-col gap-4 ', className)} {...rest}>
			{children}
		</motion.div>
	);
}
