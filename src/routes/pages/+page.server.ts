import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		return {
			loggedIn: false
		};
	}

	const pages = await prisma.page.findMany({
		where: {
			userId: session?.user.userId as string
		}
	});

	return {
		pages
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createPage: async ({ request, locals }) => {
		const formData = await request.formData();
		const session = await locals.auth.validate();
		const user_id = session?.user.userId;
		const name = formData.get('page_name');

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
	},
	addLinkPage: async ({ request, locals }) => {
		const formData = await request.formData();
		const session = await locals.auth.validate();
		const page_id = formData.get('page_id');
		const link_name = formData.get('link_name');
		const link_url = formData.get('link_url');

		const new_link = await prisma.link.create({
			data: {
				name: link_name as string,
				url: link_url as string,
				pageId: page_id as string,
				userId: session?.user.userId as string
			}
		});

		if (!new_link) {
			throw Error('failed to create link');
		}

		return {
			msg: 'success',
			page_link: new_link
		};
	},
	deleteLinkPage: async ({ request }) => {
		const formData = await request.formData();
		const link_id = formData.get('link_id');
		const page_id = formData.get('page_id');

		const delete_link = await prisma.link.delete({
			where: {
				id: link_id as string,
				pageId: page_id as string
			}
		});

		if (!delete_link) {
			throw Error('failed to delete link');
		}

		return {
			msg: 'deleted',
			deleted_link: delete_link
		};
	}
};
