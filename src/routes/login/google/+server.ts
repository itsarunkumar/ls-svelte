import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { googleAuth } from '$lib/server/lucia.js';

export const GET: RequestHandler = async ({ cookies }) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();
	// store state
	cookies.set('google_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
