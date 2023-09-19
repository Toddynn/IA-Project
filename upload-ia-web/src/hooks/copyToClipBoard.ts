import { Toast } from '@/components/Swal/Toast';

export async function CopyToClipBoard(text: string) {
	if (text) {
		return navigator.clipboard
			.writeText(text)
			.then(() => {
				Toast.fire({
					icon: 'success',
					title: 'Texto copiado para a área de transferência: ',
				});
			})
			.catch((err) => {
				Toast.fire({
					icon: 'error',
					title: 'Error ao copiar texto para a área de transferência ',
					text: err.response.data.message,
				});
			});
	} else {
		return Toast.fire({
			icon: 'error',
			title: 'Não há texto para ser copiado',
			timer: 1500,
		});
	}
}
