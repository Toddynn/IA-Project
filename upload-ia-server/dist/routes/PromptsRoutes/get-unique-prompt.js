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
exports.getUniquePromptRoute = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const TranscriptionParamsSchema = zod_1.z.object({
    title: zod_1.z.string(),
});
function getUniquePromptRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/prompts/:title', (req) => __awaiter(this, void 0, void 0, function* () {
            const { title } = TranscriptionParamsSchema.parse(req.params);
            const prompts = yield prisma_1.prisma.prompt.findMany({
                where: {
                    title: {
                        contains: title,
                    },
                },
            });
            return prompts;
        }));
    });
}
exports.getUniquePromptRoute = getUniquePromptRoute;
//# sourceMappingURL=get-unique-prompt.js.map