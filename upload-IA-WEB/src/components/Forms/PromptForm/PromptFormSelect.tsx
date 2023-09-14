import { dataGet } from '@/hooks/dataGet';
import { UUID } from 'crypto';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export interface getPrompts {
	id: UUID;
	title: string;
	template: string;
}

export interface PromptSelectProps {
	onPromptSelected(template: string): void;
}

export default function PromptFormSelect({ onPromptSelected }: PromptSelectProps) {
	const { data: Prompts } = dataGet<getPrompts[]>(`/prompts`);

	function handlePromptSelected(idPrompt: UUID) {
		const selectedPrompt = Prompts?.find((prompt) => prompt.id === idPrompt);
		if (!selectedPrompt) return;
		return onPromptSelected(selectedPrompt.template);
	}
	return (
		<Select onValueChange={handlePromptSelected}>
			<SelectTrigger>
				<SelectValue placeholder="Selecione um prompt..." />
			</SelectTrigger>
			<SelectContent>
				{Prompts?.map((prompt) => {
					return (
						<SelectItem key={prompt.id} value={prompt.id}>
							{prompt.title}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}
