import { MotionProps, motion } from 'framer-motion';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export type CombinedProps = MotionProps & HTMLAttributes<HTMLDivElement>;

export interface NavActionProps extends CombinedProps {}
export default function NavAction({ children, className, ...rest }: NavActionProps) {
	return (
		<motion.div className={twMerge('', className)} {...rest}>
			{children}
		</motion.div>
	);
}
