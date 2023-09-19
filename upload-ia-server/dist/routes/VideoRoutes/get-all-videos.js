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
exports.getAllVideosRoute = void 0;
const prisma_1 = require("../../lib/prisma");
function getAllVideosRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/videos', () => __awaiter(this, void 0, void 0, function* () {
            const videos = yield prisma_1.prisma.video.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return videos;
        }));
    });
}
exports.getAllVideosRoute = getAllVideosRoute;
//# sourceMappingURL=get-all-videos.js.map