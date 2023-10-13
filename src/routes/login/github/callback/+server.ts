// routes/login/github/callback/+server.ts
import { auth, githubAuth } from '$lib/server/lucia.js';
// import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
	console.log('callback gituhub');

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
		console.log(githubUser);

		if (existingUser) return existingUser;
		const user = await createUser({
			attributes: {
				email: githubUser.email as string
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
