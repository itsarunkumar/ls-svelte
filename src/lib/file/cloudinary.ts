import { v2 as cloudinary } from 'cloudinary';
// import { env } from '$env/dynamic/private';

cloudinary.config({
	secure: true
});

console.log(cloudinary.config);
