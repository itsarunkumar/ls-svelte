import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const session = await locals.auth.validate();

	const unique_page = params.page;

	const public_page = await prisma.page.findUnique({
		where: {
			name_userId: {
				name: unique_page as string,
				userId: session?.user.id as string
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
		page: public_page
	};
}) satisfies PageServerLoad;
