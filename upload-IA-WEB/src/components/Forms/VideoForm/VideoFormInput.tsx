import { DetailedHTMLProps } from 'react';
import { twMerge } from 'tailwind-merge';

export interface VideoFormInputProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}
export default function VideoFormInput({ className, onChange, id, accept, ...rest }: VideoFormInputProps) {
	return <input id={id} onChange={onChange} className={twMerge('sr-only ', className)} {...rest} accept={accept} />;
}
