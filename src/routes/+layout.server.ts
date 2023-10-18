import { prisma } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		return {
			loggedIn: false
		};
	}

	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id
		}
	});

	return {
		userId: session.user.userId,
		user: user,
		loggedIn: true
	};
}) satisfies LayoutServerLoad;
