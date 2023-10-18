import { prisma } from '$lib/server/prisma';
import type { Page } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const session = await locals.auth.validate();
	const pageid = url.searchParams.get('pageid');

	if (!session) {
		return {
			loggedIn: false
		};
	}

	const pages: Page[] = await prisma.page.findMany({
		where: {
			userId: session?.user.userId as string
		}
	});

	let singlePage;

	if (pageid) {
		singlePage = await prisma.page.findUnique({
			where: {
				id: pageid as string
			},
			include: {
				links: true
			}
		});
	}

	return {
		pages,
		singlePage: singlePage ? singlePage : null
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createPage: async ({ request, locals }) => {
		const formData = await request.formData();
		const session = await locals.auth.validate();
		const user_id = session?.user.userId;
		const name = formData.get('page_name')?.toString().toLowerCase();

		const existsPage = await prisma.page.findUnique({
			where: {
				name_userId: {
					name: name as string,
					userId: user_id as string
				}
			}
		});

		if (existsPage) {
			return {
				msg: 'page already exists',
				created: false
			};
		}

		const new_page = await prisma.page.create({
			data: {
				name: name as string,
				userId: user_id as string
			}
		});

		if (!new_page) {
			throw Error('failed to create page');
		}

		return {
			page: new_page,
			msg: 'success'
		};
	},
	deletePage: async ({ request }) => {
		const formData = await request.formData();
		const page_id = formData.get('page_id');

		const delete_page = await prisma.page.delete({
			where: {
				id: page_id as string
			}
		});

		if (!delete_page) {
			throw Error('failed to delete page');
		}

		return {
			msg: 'deleted',
			deleted_page: delete_page
		};
	}
};
