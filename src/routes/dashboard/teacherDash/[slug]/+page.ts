import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    return {
    classID: params.slug
    };
};

export interface slug{
    classID: string
}