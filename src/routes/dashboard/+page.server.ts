import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import type { User } from '@prisma/client';

interface UserWithSocialLinks extends User {
	social_links: {
		id: string;
		name: string;
		username: string;
		url: string;
	}[];
}

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	// if (!session) {
	// 	throw redirect(302, '/');
	// }
	const user: UserWithSocialLinks | null = await prisma.user.findUnique({
		where: {
			id: session?.user.userId
		},
		include: {
			social_links: true
		}
	});

	const links = await prisma.link.findMany({
		where: {
			userId: session?.user.userId,
			AND: {
				pageId: null
			}
		}
	});

	return {
		user,
		links
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	username: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const data = await request.formData();
		const username = data.get('username');

		const usernameExists = await prisma.user.findUnique({
			where: {
				username: username as string
			}
		});

		if (usernameExists) {
			throw Error('username already exists');
		}

		const profileChange = await prisma.user.update({
			where: {
				id: session?.user.userId as string
			},
			data: {
				username: username as string
			}
		});

		return {
			msg: 'success',
			profile: profileChange
		};
	},
	social: async ({ request, locals }) => {
		const data = await request.formData();
		const session = await locals.auth.validate();
		// Convert FormData entries to an array of objects
		const socialLinksData = Array.from(data.entries()).map(([name, username]) => ({
			name,
			username
		}));

		// Use Promise.all to concurrently create social links
		await Promise.all(
			socialLinksData.map(async (linkData) => {
				await prisma.socialLink.upsert({
					where: {
						name: linkData.name as string,
						userId: session?.user.userId as string
					},
					update: {
						username: linkData.username as string,
						url: fullUrlwithusername(linkData.name as string, linkData.username as string)
					},
					create: {
						name: linkData.name,
						username: linkData.username as string,
						url: fullUrlwithusername(linkData.name as string, linkData.username as string),
						userId: session?.user.userId as string
					}
				});
			})
		);

		return {
			msg: 'success'
		};
	},
	createLink: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const data = await request.formData();
		const name = data.get('name');
		const url = data.get('url');

		const newlink = await prisma.link.create({
			data: {
				name: name as string,
				url: url as string,
				userId: session?.user.userId as string
			}
		});

		return {
			link: newlink
		};
	},
	deleteSocialLink: async ({ request }) => {
		const data = await request.formData();
		const social_id = data.get('id');

		await prisma.socialLink.delete({
			where: {
				id: social_id as string
			}
		});

		return {
			msg: 'success'
		};
	},
	deleteLink: async ({ request }) => {
		const data = await request.formData();
		const link_id = data.get('id');

		await prisma.link.delete({
			where: {
				id: link_id as string
			}
		});

		return {
			msg: 'success'
		};
	}
};

function fullUrlwithusername(name: string, username: string): string {
	if (name === 'youtube') {
		return `https://youtube.com/@${username}`;
	}
	return `https://www.${name}.com/${username}`;
}
