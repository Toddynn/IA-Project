import { MotionProps, motion } from 'framer-motion';
import { HTMLAttributes } from 'react';
export type CombinedProps = MotionProps & HTMLAttributes<HTMLDivElement>;
export interface NavLogoProps extends CombinedProps {}
export const Fade = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.6,
			delay: 0.2,
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 0.6,
		},
	},
};
export const SlideFromLeft = {
	hidden: {
		x: -350,
	},
	visible: {
		x: 0,
		transition: {
			duration: 0.6,
			type: 'spring',
			damping: 25,
			stiffness: 500,
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 0.6,
		},
	},
};

export default function NavLogo({ ...rest }: NavLogoProps) {
	return (
		<motion.div variants={SlideFromLeft} initial="hidden" animate="visible" exit="exit" {...rest}>
			<h1 className="text-xl font-bold">
				Pormade
				<motion.span variants={Fade} initial="hidden" animate="visible" exit="exit" className="text-green-600">
					.ai
				</motion.span>
			</h1>
		</motion.div>
	);
}
