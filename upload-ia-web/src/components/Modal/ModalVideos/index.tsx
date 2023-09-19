import { VideoConverted } from '@/App';
import { Button } from '@/components/ui/button';
import { dropIn } from '@/constants/animation';
import { dataGet } from '@/hooks/dataGet';
import { Backdrop, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import { Headphones, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { Modal } from '..';

export interface ModalVideosProps {
	showModalVideos: boolean;
	toggleModalVideos(): void;
	handleCopyVideoTranscription(video: VideoConverted): void;
}

export default function ModalVideos({ showModalVideos, toggleModalVideos, handleCopyVideoTranscription }: ModalVideosProps) {
	const { data: Videos } = dataGet<VideoConverted[]>(`/videos`);

	const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	function handlePlayAudio(idVideo: string) {
		const video = Videos?.find((video: VideoConverted) => video.id === idVideo);

		if (video) {
			setAudioUrl(video.url);
			audioRef.current = new Audio(video.url);
			play();
		}
	}

	const play = () => {
		setIsPlaying(!isPlaying);
		if (audioRef.current) {
			return isPlaying ? audioRef.current.pause() : audioRef.current.play();
		}
	};

	return (
		<Backdrop component={'div'} open={showModalVideos} onClick={toggleModalVideos}>
			<audio ref={audioRef} controls className="sr-only">
				<source src={audioUrl} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
			<Modal.Root
				variants={dropIn}
				initial="hidden"
				animate="visible"
				exit="exit"
				transition={{ duration: 0.6 }}
				close={toggleModalVideos}
				className="w-[75%] shadow-2xl md:w-[50%]"
			>
				<Modal.Content className="flex-1 justify-between">
					<h1 className="text-primary">Vídeos já carregados</h1>

					<div className="scrollTextArea flex max-h-[500px] w-full flex-1 flex-col gap-2 overflow-y-auto">
						{Videos?.map((video: VideoConverted) => {
							const createdAtFormated = format(new Date(video.createdAt), 'dd-MM-yyyy');
							return (
								<div
									className="group flex h-16 w-full cursor-pointer items-center justify-between rounded-md bg-secondary px-4 text-left"
									key={video.id}
									onClick={() => handleCopyVideoTranscription(video)}
								>
									<Button className=" h-full p-0 transition-all  duration-75 group-hover:translate-x-2" variant={'secondary'}>
										<div className="flex items-center gap-4">
											<div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-800/70">
												<Headphones />
											</div>
											<div className="flex flex-col gap-1">
												<h1 className="line-clamp-1">{video.name}</h1>
												<span className="text-xs text-muted-foreground">{createdAtFormated}</span>
											</div>
										</div>
									</Button>
									<Button
										size={'icon'}
										className=" rounded-full"
										onClick={(e: any) => {
											e.stopPropagation();
											handlePlayAudio(video.id);
										}}
									>
										<Play className="translate-x-0.5" />
									</Button>
								</div>
							);
						})}
					</div>

					<span className=" absolute bottom-2 cursor-default text-center text-sm text-muted-foreground">
						Clique no vídeo desejado para copiar a{' '}
						<Tooltip title={'A transcrição se refere à conversão do conteúdo de áudio ou vídeo em texto escrito.'}>
							<span className="text-primary">transcrição</span>
						</Tooltip>{' '}
						em nossa base!
					</span>
				</Modal.Content>
			</Modal.Root>
		</Backdrop>
	);
}
