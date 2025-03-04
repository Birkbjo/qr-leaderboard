export interface NextPageProps<SlugType = string> {
	params: Promise<{ slug: SlugType }>;
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface Challenge {
	id: string;
	title: string;
	description: string;

}