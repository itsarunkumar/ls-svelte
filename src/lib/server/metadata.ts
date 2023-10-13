import * as http from 'http';
import * as https from 'https';
import { parse } from 'url';
import { createReadStream } from 'fs';

interface Metadata {
	title: string;
	description: string;
	// Add more fields as needed
}

export function metaData(url: string): Promise<Metadata> {
	const protocol = url.startsWith('https') ? https : http;

	return new Promise<Metadata>((resolve, reject) => {
		const parsedUrl = parse(url);
		const options = {
			hostname: parsedUrl.hostname,
			path: parsedUrl.path,
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0' // Set a user agent to prevent some websites from blocking the request
			}
		};

		const req = protocol.get(options, (res) => {
			let rawData = '';
			res.setEncoding('utf8');

			res.on('data', (chunk) => {
				rawData += chunk;
			});

			res.on('end', () => {
				try {
					const metadata: Metadata = {
						title: extractTitle(rawData),
						description: extractDescription(rawData)
					};
					resolve(metadata);
				} catch (error) {
					reject(error);
				}
			});
		});

		req.on('error', (error) => {
			reject(error);
		});

		req.end();
	});
}

function extractTitle(html: string): string {
	// Implement your logic to extract the title from the HTML here
	// You can use regular expressions or a library like 'cheerio' for HTML parsing
	// For simplicity, this example uses a regular expression to extract the title.
	const titleMatch = html.match(/<title>(.*?)<\/title>/i);
	return titleMatch ? titleMatch[1] : '';
}

function extractDescription(html: string): string {
	// Implement your logic to extract the description from the HTML here
	// You can use regular expressions or other techniques as needed.
	// For simplicity, this example uses a regular expression to extract the description.
	const descriptionMatch = html.match(/<meta name="description" content="(.*?)"\s*\/?>/i);
	return descriptionMatch ? descriptionMatch[1] : '';
}

// Example usage:
// getMetadata('https://example.com')
// 	.then((metadata) => {
// 		console.log('Title:', metadata.title);
// 		console.log('Description:', metadata.description);
// 	})
// 	.catch((error) => {
// 		console.error('Error:', error);
// 	});
