"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompletionRoute = void 0;
const ai_1 = require("ai");
const zod_1 = require("zod");
const openAI_1 = require("../../lib/openAI");
const prisma_1 = require("../../lib/prisma");
const CompletionRouteBodySchema = zod_1.z.object({
    videoId: zod_1.z.string().uuid(),
    prompt: zod_1.z.string(),
    temperature: zod_1.z.number().min(0).max(1).default(0.5),
});
function createCompletionRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/ai/complete', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { videoId, prompt, temperature } = CompletionRouteBodySchema.parse(req.body);
            const video = yield prisma_1.prisma.video.findUniqueOrThrow({
                where: {
                    id: videoId,
                },
            });
            if (!video.transcription)
                return res.status(404).send({ message: 'Video transcription was not generated yet.' });
            const promptMessage = prompt.replace('{transcription}', video.transcription);
            const response = yield openAI_1.openai.chat.completions.create({
                model: 'gpt-3.5-turbo-16k',
                temperature,
                messages: [
                    {
                        role: 'user',
                        content: promptMessage,
                    },
                ],
                stream: true,
            });
            const stream = (0, ai_1.OpenAIStream)(response);
            (0, ai_1.streamToResponse)(stream, res.raw, {
                headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' },
            });
        }));
    });
}
exports.createCompletionRoute = createCompletionRoute;
//# sourceMappingURL=create-completion.js.map