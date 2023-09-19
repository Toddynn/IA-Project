import { MotionProps, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ModalRootProps extends MotionProps {
	close(): void;
	className?: string;
	children: ReactNode;
	conteudo?: unknown;
}

export default function ModalRoot({ className, children, conteudo, close, ...rest }: ModalRootProps) {
	return (
		<motion.div
			onClick={(e: any) => e.stopPropagation()}
			className={twMerge('relative inset-0 h-[65%] w-[65%] rounded-lg bg-popover p-4', className)}
			{...rest}
		>
			<div
				onClick={close}
				className="group absolute right-5 top-5 flex items-center justify-center rounded-full p-2 transition-all duration-100 hover:translate-y-1  hover:bg-muted "
			>
				<ChevronDown className="" />
			</div>
			{children}
		</motion.div>
	);
}
