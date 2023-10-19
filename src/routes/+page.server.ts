// routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
	// upload();
	return {};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/'); // redirect to login page
	},
	upload: async ({ request, locals }) => {
		const data = await request.formData();
		const session = await locals.auth.validate();
		const file = data.get('image') as File;

		const af = await file.arrayBuffer();
		const b = Buffer.from(af);

		return new Promise((resolve, reject) => {
			cloudinary.uploader.upload_stream({ resource_type: 'image' }, onDone).end(b);

			async function onDone(error, result) {
				if (error) {
					return reject({ success: false, error });
				}
				console.log(result);

				await prisma.user.update({
					where: {
						id: session?.user.id as string
					},
					data: {
						profile_pic: result.secure_url
					}
				});

				return resolve({ success: true, result });
			}
		});
	}
};
