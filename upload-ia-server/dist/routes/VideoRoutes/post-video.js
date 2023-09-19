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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postVideoRoute = void 0;
const multipart_1 = require("@fastify/multipart");
require("dotenv/config");
const node_crypto_1 = require("node:crypto");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const prisma_1 = require("../../lib/prisma");
const pump = (0, node_util_1.promisify)(node_stream_1.pipeline);
function postVideoRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.register(multipart_1.fastifyMultipart, {
            limits: {
                fileSize: 25 * 1024 * 1024,
            },
        });
        app.post('/videos', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield req.file();
            if (!data)
                return res.status(400).send({ message: 'Missing file input' });
            const fileExtension = node_path_1.default.extname(data.filename);
            if (fileExtension !== '.mp3')
                return res.status(404).send({ message: 'Invalid file type, please upload a mp3 file' });
            const fileBaseName = node_path_1.default.basename(data.filename, fileExtension);
            const fileUploadName = `${fileBaseName}-${(0, node_crypto_1.randomUUID)()}${fileExtension}`;
            const uploadDestination = node_path_1.default.resolve(__dirname, '../../../tmp', fileUploadName);
            const url = `${process.env.APP_URL}/tmp/${fileUploadName}`;
            yield pump(data.file, node_fs_1.default.createWriteStream(uploadDestination));
            try {
                const video = yield prisma_1.prisma.video.create({
                    data: {
                        name: data.filename,
                        path: uploadDestination,
                        url: url,
                    },
                });
                return { video };
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: 'Failed to create video record' });
            }
        }));
    });
}
exports.postVideoRoute = postVideoRoute;
//# sourceMappingURL=post-video.js.map