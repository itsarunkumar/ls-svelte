import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const data = await request.formData();
		const username = data.get('username');
		const user_id = session?.user.userId;

		const usernameExists = await prisma.user.findUnique({
			where: {
				username: username as string
			}
		});

		// check if the user already have a username
		const user_have_username = await prisma.user.findUnique({
			where: {
				id: user_id as string
			}
		});

		if (usernameExists || user_have_username?.username !== null) {
			// return {
			// 	username,
			// 	msg: 'username already exists'
			// };
			throw Error('username already exists');
		}

		const new_username = await prisma.user.update({
			where: {
				id: user_id as string
			},
			data: {
				username: username as string
			}
		});

		return {
			username: new_username,
			msg: 'success'
		};
	}
};
