import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { uploadFile } from '$lib/file/cloudinary';

export const load = (async ({ params }: { params: { pageid: string } }) => {
	const { pageid } = params;

	const page_details = await prisma.page.findUnique({
		where: {
			id: pageid
		},
		include: {
			links: true
		}
	});

	return {
		page: page_details
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	addLinkPage: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const session = await locals.auth.validate();
		const page_id = params.pageid;
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
	deleteLinkPage: async ({ request, params }) => {
		const formData = await request.formData();
		const link_id = formData.get('link_id');
		const page_id = params.pageid;

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
	},
	upload: async ({ request, locals }) => {
		const data = await request.formData();
		const session = await locals.auth.validate();
		const file = data.get('image') as File;
		const page_id = data.get('pageid');

		await uploadFile(
			file,
			session?.user.id as string,
			session?.user.email as string,
			'ls-page-pics',
			(url) => {
				return prisma.page.update({
					where: {
						id: page_id as string
					},
					data: {
						page_pic: url
					}
				});
			}
		);
	}
};
