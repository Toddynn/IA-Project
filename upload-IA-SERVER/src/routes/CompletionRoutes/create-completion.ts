import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { openai } from '../../lib/openAI';
import { prisma } from '../../lib/prisma';

const CompletionRouteBodySchema = z.object({
	videoId: z.string().uuid(),
	template: z.string(),
	temperature: z.number().min(0).max(1).default(0.5),
});

export async function createCompletionRoute(app: FastifyInstance) {
	app.post('/ai/complete', async (req, res) => {
		const { videoId, template, temperature } = CompletionRouteBodySchema.parse(req.body);

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			},
		});

		if (!video.transcription) return res.status(404).send({ message: 'Video transcription was not generated yet.' });

		const promptMessage = template.replace('{transcription}', video.transcription);

		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo-16k',
			temperature,
			messages: [
				{
					role: 'user',
					content: promptMessage,
				},
			],
		});

		return response;
	});
}
