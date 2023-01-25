// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			fleet: {
				connected: boolean;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}

	type UserData = {
		id: string;
		connectedFleet?: boolean;
		image?: string;
		name?: string;
		email?: string;
	};

	// eslint-disable-next-line no-var
	var prisma: PrismaClient;
}

export {};
