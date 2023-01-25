import { SvelteKitAuth } from '@auth/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import Discord from '@auth/core/providers/discord';
import { connectUsertoService, getApiVersion, getUserDirectives } from '$lib/server/fleet';

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';

const authjsAuth = SvelteKitAuth({
	callbacks: {
		session({ session, token }) {
			// console.log('token', token);
			if (session.user && token) {
				// @ts-expect-error next-auth.d.ts not working in sveltekit
				session.user.id = token.sub as string;
			}
			return session;
		}
	},
	providers: [
		// @ts-expect-error Discord not officially supported yet
		Discord({
			clientId: DISCORD_CLIENT_ID,
			clientSecret: DISCORD_CLIENT_SECRET
		})
	]
});

// @ts-expect-error From the above callback session
async function fleetAuth({ event, resolve }) {
	const { locals } = event;
	const session = await locals.getSession();
	if (session) {
		locals.fleet = {
			connected: await connectUsertoService(session.user.id, session.user.name),
			version: await getApiVersion(),
			directives: await getUserDirectives(session.user.id)
		};
	} else {
		locals.fleet = {
			connected: false,
			version: '',
			directives: []
		};
	}

	return resolve(event); //
}

export const handle = sequence(authjsAuth, fleetAuth);
