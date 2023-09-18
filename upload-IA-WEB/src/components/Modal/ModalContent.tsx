import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { CombinedProps } from '../Nav/NavLogo';

export interface ModalContentProps extends CombinedProps {}
export default function ModalContent({ className, children, variants, initial, animate, exit, transition, ...rest }: ModalContentProps) {
	return (
		<motion.div
			variants={variants}
			initial={initial}
			animate={animate}
			exit={exit}
			transition={transition}
			className={twMerge('my-12 flex flex-1 flex-col items-center justify-center space-y-3', className)}
			{...rest}
		>
			{children}
		</motion.div>
	);
}
