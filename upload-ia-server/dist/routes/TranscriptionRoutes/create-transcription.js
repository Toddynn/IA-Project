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
exports.createTranscriptionRoute = void 0;
const node_fs_1 = require("node:fs");
const zod_1 = require("zod");
const openAI_1 = require("../../lib/openAI");
const prisma_1 = require("../../lib/prisma");
const TranscriptionParamsSchema = zod_1.z.object({
    videoId: zod_1.z.string().uuid(),
});
const TranscriptionBodySchema = zod_1.z.object({
    prompt: zod_1.z.string().optional(),
});
function createTranscriptionRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/videos/:videoId/transcription', (req) => __awaiter(this, void 0, void 0, function* () {
            const { videoId } = TranscriptionParamsSchema.parse(req.params);
            const { prompt } = TranscriptionBodySchema.parse(req.body);
            const video = yield prisma_1.prisma.video.findUniqueOrThrow({
                where: {
                    id: videoId,
                },
            });
            const videoPath = video.path;
            const audioReadStream = (0, node_fs_1.createReadStream)(videoPath);
            const responseOpenAI = yield openAI_1.openai.audio.transcriptions.create({
                file: audioReadStream,
                model: 'whisper-1',
                language: 'pt',
                response_format: 'json',
                temperature: 0,
                prompt,
            });
            const transcription = responseOpenAI.text;
            yield prisma_1.prisma.video.update({
                where: {
                    id: videoId,
                },
                data: {
                    transcription: transcription,
                },
            });
            return { transcription };
        }));
    });
}
exports.createTranscriptionRoute = createTranscriptionRoute;
//# sourceMappingURL=create-transcription.js.map