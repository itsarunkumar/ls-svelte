import type { Action } from 'svelte/action';

type Attribute = {
	'on:copied': (e: CustomEvent) => void;
};

type Options = {
	text: string;
};

type Copy = Action<HTMLElement, Options, Attribute>;

export const copy: Copy = (node, { text }) => {
	function writeToClipboard(e: MouseEvent) {
		e.preventDefault();
		navigator.clipboard
			.writeText(text)
			.then(() => {
				// Dispatch a custom event with the copied text
				const event = new CustomEvent('copied', { detail: { copiedText: text } });
				node.dispatchEvent(event);
			})
			.catch((error) => {
				console.error('Error copying text:', error);
			});
	}

	node.addEventListener('click', writeToClipboard);

	return {
		destroy() {
			node.removeEventListener('click', writeToClipboard);
		}
	};
};
