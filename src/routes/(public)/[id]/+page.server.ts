import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const username = params.id;

	const public_details = await prisma.user.findUnique({
		where: { username: username as string },
		select: {
			social_links: true,
			links: true,
			username: true,
			profile_pic: true
		}
	});

	return {
		public_details
	};
}) satisfies PageServerLoad;
