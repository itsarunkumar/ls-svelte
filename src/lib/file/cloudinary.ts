import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	secure: true
});

export async function uploadFile(
	file: File,
	userid: string,
	email: string,
	folder: string,
	onSave: (url: string) => void
) {
	const arrayBuffer = await file.arrayBuffer();
	const b = Buffer.from(arrayBuffer);

	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					resource_type: 'image',
					invalidate: true,
					overwrite: true,
					filename_override: `${userid}${email}`,
					allowed_formats: ['jpg', 'png', 'gif'],
					folder: folder,
					use_filename: true,
					access_mode: 'public',
					use_asset_folder_as_public_id_prefix: false,
					unique_filename: false
				},
				onDone
			)
			.end(b);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async function onDone(error: any, result: any) {
			if (error) {
				return reject({ success: false, error });
			}

			await onSave(result.secure_url);

			return resolve({ success: true, result });
		}
	});
}
