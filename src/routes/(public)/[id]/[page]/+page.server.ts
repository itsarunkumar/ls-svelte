import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const unique_page = params.page;

	const user = await prisma.user.findUnique({
		where: {
			username: params.id as string
		}
	});

	const public_page = prisma.page.findUnique({
		where: {
			name_userId: {
				name: unique_page,
				userId: user?.id as string
			}
		},
		include: {
			links: {
				orderBy: {
					createdAt: 'desc'
				}
			}
		}
	});

	return {
		stream: {
			page: public_page
		},
		user: user
	};
}) satisfies PageServerLoad;
