import { fastifyMultipart } from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { prisma } from '../../lib/prisma';

const pump = promisify(pipeline);

export async function postVideoRoute(app: FastifyInstance) {
	app.register(fastifyMultipart, {
		limits: {
			fileSize: 25 * 1024 * 1024,
		},
	});

	app.post('/videos', async (req, res) => {
		const data = await req.file();

		if (!data) return res.status(400).send({ message: 'Missing file input' });

		const fileExtension = path.extname(data.filename);

		if (fileExtension !== '.mp3') return res.status(404).send({ message: 'Invalid file type, please upload a mp3 file' });

		const fileBaseName = path.basename(data.filename, fileExtension);
		const fileUploadName = `${fileBaseName}-${randomUUID()}${fileExtension}`;

		const uploadDestination = path.resolve(__dirname, '../../../tmp', fileUploadName);

		await pump(data.file, fs.createWriteStream(uploadDestination));

		const video = await prisma.video.create({
			data: {
				name: data.filename,
				path: uploadDestination,
			},
		});

		return { video };
	});
}
