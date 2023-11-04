import type { RequestHandler } from './$types';
import { auth, googleAuth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	const { getExistingUser, googleUser, createUser } = await googleAuth.validateCallback(code);

	const getUser = async () => {
		const existingUser = await getExistingUser();
		if (existingUser) return existingUser;

		const user = await createUser({
			attributes: {
				email: googleUser.email as string
			}
		});

		// set profile pic from oauth account as default
		await prisma.user.update({
			where: {
				id: user.userId
			},
			data: {
				profile_pic: googleUser.picture as string
			}
		});

		return user;
	};

	const user = await getUser();
	const session = await auth.createSession({
		userId: user.userId,
		attributes: {}
	});
	locals.auth.setSession(session);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
};
