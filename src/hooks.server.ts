// src/hooks.server.ts
import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

const publicRoutes: string[] = [
	'/',
	'/(auth)/login',
	'/(public)/[id]',
	'/(public)/[id]/[page]',
	'/(auth)/login/google/callback',
	'/(auth)/login/github/callback',
	'/(auth)/login/github',
	'/(auth)/login/google'
];

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize the `auth` middleware to handle authentication
	event.locals.auth = auth.handleRequest(event);

	const session = await event.locals.auth.validate();

	if (session === null && !publicRoutes.includes(event.route.id as string)) {
		throw redirect(302, '/');
	}

	const response = await resolve(event);
	return response;
};
