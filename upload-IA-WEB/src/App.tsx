import { Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useCompletion } from 'ai/react';
import { UUID } from 'crypto';
import { AlertCircle, CheckCircle, ClipboardIcon, FileVideo, Leaf, Upload, Wand2 } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { PromptForm } from './components/Forms/PromptForm';
import { VideoForm } from './components/Forms/VideoForm';
import { Nav } from './components/Nav';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { Slider } from './components/ui/slider';
import { Textarea } from './components/ui/textarea';
import { convertVideoToAudio } from './hooks/convertVideoToAudio';
import { CopyToClipBoard } from './hooks/copyToClipBoard';
import { api } from './lib/api/axios';

export type Status = 'waiting' | 'converting' | 'converted' | 'uploading' | 'transcribing' | 'success' | 'error';

export interface VideoConverted {
	createdAt: Date;
	id: UUID;
	name: string;
	path: string;
	transcription?: string;
}
function App() {
	const [file, setFile] = useState<File | null>(null);
	const [transcription, setTranscription] = useState<string | null>(null);
	const [status, setStatus] = useState<Status>('waiting');
	const [temperature, setTemperature] = useState(0.5);
	const [videoId, setVideoId] = useState<string | null>(null);

	const promptTranscriptionInputRef = useRef<HTMLTextAreaElement>(null);

	const statusRenderMessage = useMemo(() => {
		switch (status) {
			case 'converting':
				return (
					<>
						Convertendo...
						<CircularProgress color="success" size={22} />
					</>
				);
			case 'waiting':
				return (
					<>
						Carregar Vídeo <Upload className="h-4 w-4 " />
					</>
				);
			case 'converted':
				return <>Convertido</>;
			case 'uploading':
				return (
					<>
						Uploading <CircularProgress color="success" size={22} />
					</>
				);
			case 'transcribing':
				return (
					<>
						Transcrevendo <CircularProgress color="success" size={22} />
					</>
				);
			case 'success':
				return (
					<>
						Sucesso <CheckCircle className="h-4 w-4 " />
					</>
				);
			case 'error':
				return (
					<>
						Falha <AlertCircle className="h-4 w-4 " />
					</>
				);
		}
	}, [status]);

	const {
		input,
		setInput,
		handleInputChange,
		handleSubmit: handleUploadPrompt,
		completion,
		isLoading,
	} = useCompletion({
		api: 'http://localhost:3333/ai/complete',
		body: {
			videoId,
			temperature,
		},
		headers: {
			'Content-Type': 'application/json',
		},
	});

	function handleChangeFile(event: ChangeEvent<HTMLInputElement>) {
		const { files } = event.currentTarget;
		if (!files) return;

		setFile(files[0]);
	}

	async function handleUploadFile(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const prompt = promptTranscriptionInputRef.current?.value;

		if (!file) return;

		setStatus('converting');

		const audioFile = await convertVideoToAudio(file);

		setStatus('converted');

		const data = new FormData();

		data.append('file', audioFile);

		setStatus('uploading');

		const response = await api.post('/videos', data);

		const video: VideoConverted = response.data.video;

		setStatus('transcribing');

		await api
			.post(`/videos/${video.id}/transcription`, { prompt })
			.then((res) => {
				setTranscription(res.data.transcription);
				setVideoId(video.id);
				return setStatus('success');
			})
			.catch((error) => {
				console.log(error.response.data.message);
				return setStatus('error');
			});
	}

	useEffect(() => {
		if (transcription) {
			CopyToClipBoard(transcription);
		}
	}, [transcription]);

	const previewURL = useMemo(() => {
		if (!file) return null;

		return URL.createObjectURL(file);
	}, [file]);

	return (
		<div className="flex min-h-screen flex-col">
			<Nav.Root className="flex w-full items-center justify-between border-b px-6 py-3 ">
				<Nav.Logo
					drag
					dragConstraints={{
						top: -0,
						right: 0,
						bottom: 0,
						left: -0,
					}}
					dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
					dragElastic={0.5}
				/>
				<Nav.Actions>
					<Nav.Action>
						<Tooltip title={'Mais funcionalidades em breve'} placement="bottom">
							<span>Desenvolvido com 💚</span>
						</Tooltip>
					</Nav.Action>
					<Nav.Action>
						<Separator orientation="vertical" className="h-6" />
					</Nav.Action>
					<Nav.Action>
						<Tooltip title={'PETIM'} placement="bottom">
							<a href="https://petim.pormadeonline.com.br/" target="_blank">
								<Button variant={'outline'}>
									<Leaf className="mx-2 h-4 w-4" />
								</Button>
							</a>
						</Tooltip>
					</Nav.Action>
				</Nav.Actions>
			</Nav.Root>
			<main className="flex flex-1 gap-6 p-6">
				<div className="flex flex-1 flex-col gap-4 ">
					<div className="grid flex-1 grid-rows-2 gap-4">
						<Textarea
							value={input}
							onChange={handleInputChange}
							placeholder="Inclua o prompt para a IA..."
							className="scrollTextArea resize-none p-4 leading-relaxed"
						/>
						<div className="relative">
							<Textarea
								placeholder="Resultado gerado pela IA"
								value={completion}
								className="scrollTextArea relative h-full resize-none p-4 leading-relaxed"
								readOnly
							/>
							<Button variant={'outline'} onClick={() => CopyToClipBoard(completion)} className="absolute right-5 top-5">
								<ClipboardIcon className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<span className="text-sm text-muted-foreground">
						Lembre-se: você pode utilizar a variável <code className="text-green-500">{'{transcription}'}</code> no seu prompt para adicionar
						o conteúdo da transcrição do vídeo selecionado
					</span>
				</div>
				<aside className="w-80 space-y-6 ">
					<VideoForm.Root onSubmit={handleUploadFile}>
						<VideoForm.Label htmlFor="video" className="relative overflow-hidden">
							{previewURL ? (
								<>
									<video src={previewURL} className="pointers-events-none absolute inset-0 rounded-md"></video>
								</>
							) : (
								<>
									<VideoForm.Icon className="h-5 w-5" icon={FileVideo} />
									Selecione um vídeo
								</>
							)}
						</VideoForm.Label>
						<VideoForm.Input
							disabled={status !== 'waiting' && status !== 'success'}
							id="video"
							type="file"
							accept="video/mp4"
							onChange={handleChangeFile}
						/>

						<Separator />

						<div className="space-y-2">
							<Label htmlFor="transcription-prompt">Prompt de transcrição</Label>
							<Textarea
								ref={promptTranscriptionInputRef}
								disabled={status !== 'waiting'}
								id="transcription-prompt"
								placeholder="inclua plavras-chave mencionadas no vídeo separadas por vírgula (,)"
								className="scrollTextArea h-[100px] resize-none leading-relaxed"
							/>
						</div>
						<Button
							disabled={status !== 'waiting'}
							variant={status === 'success' ? 'default' : 'secondary'}
							className="flex w-full items-center justify-center gap-2"
						>
							{statusRenderMessage}
						</Button>
					</VideoForm.Root>

					<Separator />
					<PromptForm.Root onSubmit={handleUploadPrompt}>
						<PromptForm.Action>
							<Label>Prompt</Label>
							<PromptForm.Select onPromptSelected={setInput} />
						</PromptForm.Action>
						<PromptForm.Action>
							<Label>Modelo</Label>
							<Select disabled defaultValue="gpt3.5">
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
								</SelectContent>
							</Select>
						</PromptForm.Action>
						<Separator />
						<PromptForm.Action className="space-y-4">
							<Label>Temperatura</Label>
							<Tooltip placement="top" title={temperature}>
								<Slider min={0} max={1} step={0.1} value={[temperature]} onValueChange={(value) => setTemperature(value[0])} />
							</Tooltip>
							<span className="block text-xs italic leading-relaxed text-muted-foreground">
								valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
							</span>
						</PromptForm.Action>
						<Separator />
						<PromptForm.Action>
							<Button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2">
								Executar
								<Wand2 className="h-4 w-4" />
							</Button>
						</PromptForm.Action>
					</PromptForm.Root>
				</aside>
			</main>
		</div>
	);
}

export default App;
