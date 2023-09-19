import { RootCombinedProps } from '@/interfaces';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export interface NavActionProps extends RootCombinedProps {}
export default function NavAction({ children, className, ...rest }: NavActionProps) {
	return (
		<motion.div className={twMerge('', className)} {...rest}>
			{children}
		</motion.div>
	);
}
