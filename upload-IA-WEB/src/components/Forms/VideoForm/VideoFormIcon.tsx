import { ElementType, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface VideoFormIconProps extends HTMLAttributes<HTMLOrSVGImageElement> {
	icon: ElementType;
	size?: string;
}
export default function VideoFormIcon({ icon: Icon, size, className, ...rest }: VideoFormIconProps) {
	return <Icon className={twMerge(``, className)} {...rest} size={size} />;
}
