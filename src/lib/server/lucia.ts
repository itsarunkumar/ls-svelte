// src/lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { prisma as prismaclient } from '$lib/server/prisma';

import { github, google } from '@lucia-auth/oauth/providers';

import { env } from '$env/dynamic/private';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(prismaclient, {
		user: 'user', // model User {}
		key: 'key', // model Key {}
		session: 'session' // model Session {}
	}),
	getUserAttributes: (data) => {
		return {
			...data
		};
	}
});

export const githubAuth = github(auth, {
	clientId: env.GITHUB_CLIENT_ID,
	clientSecret: env.GITHUB_CLIENT_SECRET,
	redirectUri: dev
		? 'http://localhost:5173/login/github/callback'
		: 'https://linkspot.vercel.app/login/github/callback',
	scope: ['user:email', 'read:user']
});

export const googleAuth = google(auth, {
	clientId: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_CLIENT_SECRET,
	redirectUri: dev
		? 'http://localhost:5173/login/google/callback'
		: 'https://linkspot.vercel.app/login/google/callback',
	scope: [
		'https://www.googleapis.com/auth/userinfo.email',
		'https://www.googleapis.com/auth/userinfo.profile',
		'openid'
	]
});

export type Auth = typeof auth;
