import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { ShortenedUrl } from '@prisma/client';

const createShortLinkSchema = z.object({
	url: z.string().trim().min(1).url()
});

export const load: PageServerLoad = async () => {
	return {
		shortlinks: await prisma.shortenedUrl.findMany()
	};
};

export const actions: Actions = {
	createShortLink: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		const createShortLinkFormData = createShortLinkSchema.safeParse(formData);

		if (!createShortLinkFormData.success) {
			console.log(createShortLinkFormData);
			return fail(400, { error: true, message: 'Invalid form data' });
		}

		const { url } = createShortLinkFormData.data;
		const code = nanoid(6);
		let newShortLink: ShortenedUrl;

		try {
			newShortLink = await prisma.shortenedUrl.create({
				data: {
					original: url,
					shortUrl: code
				}
			});
		} catch (error) {
			console.log(error); // server side log
			return fail(500, {
				error: true,
				message: 'Something went wrong while creating the shortlink'
			});
		}

		return {
			success: true,
			code: code,
			id: newShortLink.id,
			createdAt: newShortLink.createdAt,
			original: newShortLink.original,
			visits: newShortLink.visits
		};
	}
};
