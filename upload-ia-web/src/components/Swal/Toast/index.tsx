import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
	background: '#27272a',
	color: '#fff',
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener('mouseenter', Swal.stopTimer);
		toast.addEventListener('mouseleave', Swal.resumeTimer);
	},
});
