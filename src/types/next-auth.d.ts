import { type DefaultSession } from '@auth/core/types';

declare module '@auth/sveltekit' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user?: {
			id: string;
			connectedFleet?: boolean;
		} & DefaultSession['user'];
	}
}
