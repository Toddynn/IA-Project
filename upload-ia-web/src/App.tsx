import { Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useCompletion } from 'ai/react';
import { UUID } from 'crypto';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, ClipboardIcon, FileVideo, Leaf, Upload, Video, Wand2 } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { PromptForm } from './components/Forms/PromptForm';
import { VideoForm } from './components/Forms/VideoForm';
import ModalVideos from './components/Modal/ModalVideos';
import { Nav } from './components/Nav';
import { Prompts } from './components/Prompts';
import { Toast } from './components/Swal/Toast';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
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
	url: string;
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

	const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion({
		api: 'http://localhost:3333/ai/complete',
		body: {
			videoId,
			temperature,
		},
		headers: {
			'Content-Type': 'application/json',
		},
	});

	function handleUploadPrompt(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!videoId)
			return Toast.fire({
				icon: 'info',
				title: 'Você precisa carregar um vídeo primeiro',
			});

		return handleSubmit(event);
	}

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

	function handleCopyVideoTranscription(video: VideoConverted) {
		if (video.transcription) {
			CopyToClipBoard(video.transcription);
		}
	}

	const previewURL = useMemo(() => {
		if (!file) return null;

		return URL.createObjectURL(file);
	}, [file]);

	const [showModalVideos, setShowModalVideos] = useState(false);
	const toggleModalVideos = () => {
		setShowModalVideos(!showModalVideos);
	};

	return (
		<div className="min-w-screen relative flex min-h-screen flex-col overflow-x-hidden">
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
						<Button variant={'outline'} onClick={toggleModalVideos}>
							<Video className="mx-2 h-4 w-4" />
						</Button>
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
				<Prompts.Root className="pointer-events-none hidden sm:pointer-events-auto sm:flex">
					<div className="grid flex-1 grid-rows-2 gap-4">
						<Textarea
							value={input}
							onChange={handleInputChange}
							placeholder="Inclua o prompt para a IA..."
							className="scrollTextArea resize-none p-4 leading-relaxed"
						/>
						<div className="group relative ">
							<Textarea
								placeholder="Resultado gerado pela IA"
								value={completion}
								className="scrollTextArea relative h-full resize-none p-4 leading-relaxed"
								readOnly
							/>
							<Button
								variant={'outline'}
								onClick={() => CopyToClipBoard(completion)}
								className="absolute right-5 top-5 hidden transition-all duration-75 group-hover:block"
							>
								<ClipboardIcon className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<Prompts.Caption>
						Lembre-se: você pode utilizar a variável <code className="text-green-500">{'{transcription}'}</code> no seu prompt para adicionar
						o conteúdo da transcrição do vídeo selecionado
					</Prompts.Caption>
				</Prompts.Root>
				<aside className="w-full space-y-6 sm:w-80 ">
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
						<Input
							disabled={(status !== 'waiting' && status !== 'success') || isLoading}
							id="video"
							type="file"
							accept="video/mp4"
							onChange={handleChangeFile}
							className="sr-only"
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
							type="submit"
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

						<Prompts.Root className="sm:pointer-events-hidden pointer-events-auto flex sm:hidden">
							<div className="grid flex-1 grid-rows-2 gap-4">
								<Textarea
									value={input}
									onChange={handleInputChange}
									placeholder="Inclua o prompt para a IA...
{transcription}"
									className="scrollTextArea h-full min-h-[254px] resize-none p-4 leading-relaxed"
								/>
								<div className=" relative">
									<Textarea
										placeholder="Resultado gerado pela IA"
										value={completion}
										className="scrollTextArea relative h-full min-h-[254px] resize-none p-4 leading-relaxed"
										readOnly
									/>
									<Button variant={'outline'} onClick={() => CopyToClipBoard(completion)} className="absolute bottom-5 right-5">
										<ClipboardIcon className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<Prompts.Caption>
								Lembre-se: você pode utilizar a variável <code className="text-green-500">{'{transcription}'}</code> no seu prompt para
								adicionar o conteúdo da transcrição do vídeo selecionado
							</Prompts.Caption>
						</Prompts.Root>

						<PromptForm.Action>
							<Button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2">
								Executar
								<Wand2 className="h-4 w-4" />
							</Button>
						</PromptForm.Action>
					</PromptForm.Root>
				</aside>
			</main>
			<AnimatePresence mode="wait" initial={false} onExitComplete={() => null}>
				{showModalVideos && (
					<ModalVideos
						handleCopyVideoTranscription={handleCopyVideoTranscription}
						showModalVideos={showModalVideos}
						toggleModalVideos={toggleModalVideos}
					></ModalVideos>
				)}
			</AnimatePresence>
		</div>
	);
}

export default App;
