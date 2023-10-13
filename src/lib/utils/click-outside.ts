export const clickOutside = (node: HTMLElement) => {
	function handleClick(event: MouseEvent) {
		const targetEl = event.target as HTMLElement;

		if (node && !node.contains(targetEl)) {
			const clickOutsideEvent = new CustomEvent('outside');
			node.dispatchEvent(clickOutsideEvent);
		}
	}

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
