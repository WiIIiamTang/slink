import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const shortLink = await prisma.shortenedUrl.findUnique({
		where: {
			shortUrl: params.code
		}
	});

	if (shortLink) {
		await prisma.shortenedUrl.update({
			where: {
				id: shortLink.id
			},
			data: {
				visits: shortLink.visits + 1
			}
		});
		throw redirect(302, shortLink.original);
	}

	return {
		error: true,
		message: 'Link not found.',
		code: params.code
	};
};
