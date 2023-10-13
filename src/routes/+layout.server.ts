import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		return {
			loggedIn: false
		};
	}

	return {
		userId: session.user.userId,
		user: session.user,
		loggedIn: true
	};
}) satisfies LayoutServerLoad;
