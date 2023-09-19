"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
require("dotenv/config");
const fastify_1 = require("fastify");
const create_completion_1 = require("./routes/CompletionRoutes/create-completion");
const get_all_prompts_1 = require("./routes/PromptsRoutes/get-all-prompts");
const get_unique_prompt_1 = require("./routes/PromptsRoutes/get-unique-prompt");
const create_transcription_1 = require("./routes/TranscriptionRoutes/create-transcription");
const get_all_videos_1 = require("./routes/VideoRoutes/get-all-videos");
const post_video_1 = require("./routes/VideoRoutes/post-video");
const app = (0, fastify_1.fastify)();
app.register(cors_1.default, {
    origin: '*',
});
app.register(get_all_videos_1.getAllVideosRoute);
app.register(get_all_prompts_1.getAllPromptsRoute);
app.register(get_unique_prompt_1.getUniquePromptRoute);
app.register(post_video_1.postVideoRoute);
app.register(create_transcription_1.createTranscriptionRoute);
app.register(create_completion_1.createCompletionRoute);
app.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3333 }).then(() => {
    console.log('http server listening on port 3333');
});
//# sourceMappingURL=server.js.map