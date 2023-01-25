import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { ShortenedUrl } from '@prisma/client';

const createShortLinkSchema = z.object({
	url: z.string().trim().min(1).url()
});

const deleteShortLinkSchema = z.object({
	id: z.string().trim().min(1)
});

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	// @ts-expect-error next-auth.d.ts not working in sveltekit
	const id = session?.user?.id;

	if (!id) {
		return {
			shortlinks: [],
			number: 0
		};
	}

	// wrappers
	const shortlinkWrapper = async () => {
		return await prisma.shortenedUrl.findMany({
			where: {
				userId: id
			}
		});
	};

	const numberWrapper = async () => {
		return await prisma.shortenedUrl.count({
			where: {
				userId: id
			}
		});
	};

	return {
		shortlinks: shortlinkWrapper(),
		number: numberWrapper()
	};
};

export const actions: Actions = {
	createShortLink: async ({ request, locals }) => {
		const fleet = locals.fleet;
		const formData = Object.fromEntries(await request.formData());
		const createShortLinkFormData = createShortLinkSchema.safeParse(formData);

		if (!createShortLinkFormData.success) {
			console.log(createShortLinkFormData);
			return fail(400, { error: true, message: 'Invalid form data' });
		}

		const { url } = createShortLinkFormData.data;
		const code = nanoid(4);
		const session = await locals.getSession();
		// @ts-expect-error next-auth.d.ts not working in sveltekit
		const userId = session?.user?.id;
		let newShortLink: ShortenedUrl;

		if (!userId) {
			return fail(401, {
				error: true,
				message: 'You must be logged in to create a shortlink'
			});
		}

		const directive_names = fleet.directives.map((directive) => directive.name);
		if (!directive_names.includes('CREATE_SHORTLINK')) {
			return fail(403, {
				error: true,
				message: 'You do not have permission to create a shortlink'
			});
		}

		const number = await prisma.shortenedUrl.count({
			where: {
				userId: userId
			}
		});
		const user_limit =
			fleet.directives.find((directive) => directive.name === 'CREATE_SHORTLINK_LIMIT')?.value || 0;

		if (number >= Number(user_limit)) {
			return fail(403, {
				error: true,
				message: 'You have reached your shortlink limit'
			});
		}

		try {
			newShortLink = await prisma.shortenedUrl.create({
				data: {
					original: url,
					shortUrl: code,
					userId: userId
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
			userId: newShortLink.userId,
			createdAt: newShortLink.createdAt,
			original: newShortLink.original,
			visits: newShortLink.visits
		};
	},

	deleteShortLink: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const session = await locals.getSession();
		const deleteShortLinkFormData = deleteShortLinkSchema.safeParse(formData);
		// @ts-expect-error next-auth.d.ts not working in sveltekit
		const userId = session?.user?.id;
		let deletedShortLink: ShortenedUrl;

		if (!deleteShortLinkFormData.success) {
			console.log(deleteShortLinkFormData);
			return fail(400, { error: true, message: 'Invalid form data' });
		}

		const { id } = deleteShortLinkFormData.data;

		if (!userId) {
			return fail(401, {
				error: true,
				message: 'You must be logged in to delete a shortlink'
			});
		}

		try {
			deletedShortLink = await prisma.shortenedUrl.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (error) {
			console.log(error); // server side log
			return fail(500, {
				error: true,
				message: 'Something went wrong while deleting the shortlink'
			});
		}

		return {
			success: true,
			id: deletedShortLink.id,
			code: deletedShortLink.shortUrl,
			userId: deletedShortLink.userId,
			createdAt: deletedShortLink.createdAt,
			original: deletedShortLink.original,
			visits: deletedShortLink.visits
		};
	}
};
