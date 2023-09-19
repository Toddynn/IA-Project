import { api } from '@/lib/api/axios';
import { useEffect, useState } from 'react';

export function dataGet<T = unknown>(url: string, reload?: any, otherReload?: any, anotherReload?: any) {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isCancelled = false;
		setIsLoading(true);
		api.get(url)
			.then((response) => {
				if (!isCancelled) {
					setData(response.data);
				}
			})
			.catch((err) => {
				setError(err.response.data);
			})
			.finally(() => {
				setIsLoading(false);
			});
		return () => {
			isCancelled = true;
		};
	}, [reload, otherReload, anotherReload]);

	return { data, isLoading, error, setData };
}
