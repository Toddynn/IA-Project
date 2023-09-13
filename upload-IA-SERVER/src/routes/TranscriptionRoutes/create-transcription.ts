import { FastifyInstance } from 'fastify';
import { createReadStream } from 'node:fs';
import { z } from 'zod';
import { openai } from '../../lib/openAI';
import { prisma } from '../../lib/prisma';

const TranscriptionParamsSchema = z.object({
	videoId: z.string().uuid(),
});

const TranscriptionBodySchema = z.object({
	prompt: z.string(),
});

export async function createTranscriptionRoute(app: FastifyInstance) {
	app.post('/videos/:videoId/transcription', async (req) => {
		const { videoId } = TranscriptionParamsSchema.parse(req.params);
		const { prompt } = TranscriptionBodySchema.parse(req.body);

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			},
		});

		const videoPath = video.path;
		console.log(video, videoId, prompt);

		const audioReadStream = createReadStream(videoPath);

		const responseOpenAI = await openai.audio.transcriptions.create({
			file: audioReadStream,
			model: 'whisper-1',
			language: 'pt',
			response_format: 'json',
			temperature: 0,
			prompt,
		});

		const transcription = responseOpenAI.text;
		console.log(transcription);

		await prisma.video.update({
			where: {
				id: videoId,
			},
			data: {
				transcription: transcription,
			},
		});

		return { transcription };
	});
}
