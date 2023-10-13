import type { User } from '@prisma/client';

export type Icons = {
	title: string;
	icon: ConstructorOfATypedSvelteComponent;
}[];

export interface UserWithSocialLinks extends User {
	social_links: {
		id: string;
		name: string;
		username: string;
		url: string;
	}[];
}
export type TData = {
	loggedIn: boolean;
	userId?: string | undefined;
	user: UserWithSocialLinks | null;
};
