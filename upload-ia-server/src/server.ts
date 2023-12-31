import FastifyCors from '@fastify/cors';
import 'dotenv/config';
import { fastify } from 'fastify';
import { createCompletionRoute } from './routes/CompletionRoutes/create-completion';
import { getAllPromptsRoute } from './routes/PromptsRoutes/get-all-prompts';
import { getUniquePromptRoute } from './routes/PromptsRoutes/get-unique-prompt';
import { createTranscriptionRoute } from './routes/TranscriptionRoutes/create-transcription';
import { getAllVideosRoute } from './routes/VideoRoutes/get-all-videos';
import { postVideoRoute } from './routes/VideoRoutes/post-video';

const app = fastify();

app.register(FastifyCors, {
	origin: '*',
});

app.register(getAllVideosRoute);
app.register(getAllPromptsRoute);
app.register(getUniquePromptRoute);
app.register(postVideoRoute);
app.register(createTranscriptionRoute);
app.register(createCompletionRoute);

app.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3333 }).then(() => {
	console.log('http server listening on port 3333');
});
