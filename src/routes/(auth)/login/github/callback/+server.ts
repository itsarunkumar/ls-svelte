// routes/login/github/callback/+server.ts
import { auth, githubAuth } from '$lib/server/lucia.js';
import { prisma } from '$lib/server/prisma';
// import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);

	const getUser = async () => {
		const existingUser = await getExistingUser();

		if (existingUser) return existingUser;
		const user = await createUser({
			attributes: {
				email: githubUser.email as string
			}
		});

		// set the oauth profile pic as default
		await prisma.user.update({
			where: {
				id: user.userId
			},
			data: {
				profile_pic: githubUser.avatar_url as string
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
