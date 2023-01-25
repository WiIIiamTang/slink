// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			fleet: {
				connected: boolean;
				version: string;
				directives: Array<Directive>;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}

	type Directive = {
		dId: number;
		discordAccountId: string;
		name: string;
		description: string;
		category: string;
		applyTo: string;
		value: string;
		directiveNotes: string;
		serviceId: string;
		serviceNameIdentifier: string;
		serviceSpecific: boolean;
		createdAt: string;
		expiresAt: string;
		addedBy: string;
	};

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
