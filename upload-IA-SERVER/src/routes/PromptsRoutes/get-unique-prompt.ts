import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

const TranscriptionParamsSchema = z.object({
	title: z.string(),
});

export async function getUniquePromptRoute(app: FastifyInstance) {
	app.get('/prompts/:title', async (req) => {
		const { title } = TranscriptionParamsSchema.parse(req.params);
		const prompts = await prisma.prompt.findMany({
			where: {
				title: {
					contains: title,
				},
			},
		});
		return prompts;
	});
}
