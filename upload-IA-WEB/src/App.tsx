import { FileVideo, Github, Upload, Wand2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { Slider } from './components/ui/slider';
import { Textarea } from './components/ui/textarea';

function App() {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex w-full items-center justify-between border-b px-6 py-3 ">
				<h1 className="text-xl font-bold">
					Pormade<span className="text-green-600">.ai</span>
				</h1>
				<div className="flex items-center gap-3">
					<span>Desenvolvido com 💚</span>
					<Separator orientation="vertical" className="h-6" />
					<Button variant={'outline'}>
						<Github className="mx-2 h-4 w-4" />
						Github
					</Button>
				</div>
			</div>
			<main className="flex flex-1 gap-6 p-6">
				<div className="flex flex-1 flex-col gap-4 ">
					<div className="grid flex-1 grid-rows-2 gap-4">
						<Textarea placeholder="inclua o prompt para a IA..." className="resize-none p-4 leading-relaxed" />
						<Textarea placeholder="Resultado gerado pela IA" className="resize-none p-4 leading-relaxed" readOnly />
					</div>
					<span className="text-sm text-muted-foreground">
						Lembre-se: você pode utilizar a variável <code className="text-green-500">{'{transcription}'}</code> no seu prompt para adicionar
						o conteúdo da transcrição do vídeo selecionado
					</span>
				</div>
				<aside className="w-80 space-y-6 ">
					<form className="space-y-6 ">
						<label
							htmlFor="video"
							className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm  hover:cursor-pointer hover:bg-primary/5"
						>
							<FileVideo className="h-4 w-4"></FileVideo>
							Selecione um vídeo
						</label>
						<input type="file" id="video" accept="video/mp4" className="sr-only" />
					</form>
					<Separator />
					<div className="space-y-2">
						<Label htmlFor="transcription-prompt">Prompt de transcrição</Label>
						<Textarea
							id="transcription-prompt"
							placeholder="inclua plavras-chave mencionadas no vídeo separadas por vírgula (,)"
							className="h-20 resize-none leading-relaxed"
						/>
					</div>
					<Button variant={'secondary'} className="flex w-full items-center justify-center gap-2">
						Carregar Vídeo <Upload className="h-4 w-4 " />
					</Button>
					<Separator />
					<form className="space-y-6 ">
						<div className="space-y-2">
							<Label>Prompt</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Selecione um prompt..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="titulo">Título do vídeo</SelectItem>
									<SelectItem value="descricao">Descrição do vídeo</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Modelo</Label>
							<Select disabled defaultValue="gpt3.5">
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Separator />
						<div className="space-y-4">
							<Label>Temperatura</Label>
							<Slider min={0} max={1} step={0.1} />
							<span className="block text-xs italic leading-relaxed text-muted-foreground">
								valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
							</span>
						</div>
						<Separator />
						<Button type="submit" className="flex w-full items-center justify-center gap-2">
							Executar
							<Wand2 className="h-4 w-4"></Wand2>
						</Button>
					</form>
				</aside>
			</main>
		</div>
	);
}

export default App;
