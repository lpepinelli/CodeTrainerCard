export type GithubProfile = {
    id: number;
    login: string;
    name: string | null;
    avatar: string;
    followers: number;
    commits: number;
    pullRequests: number;
}

type ProfileQuery = {
    data?: {
        user: {
            databaseId: number;
            login: string;
            name: string | null;
            avatarUrl: string;
            followers: { totalCount: number };
            pullRequests: { totalCount: number };
            contributionsCollection: { totalCommitContributions: number };
        } | null;
    };
    errors?: { type?: string; message: string }[];
}

export class GithubUserNotFoundError extends Error {}

const profileQuery = `query ($login: String!) {
    user(login: $login) {
        databaseId
        login
        name
        avatarUrl(size: 256)
        followers { totalCount }
        pullRequests { totalCount }
        contributionsCollection { totalCommitContributions }
    }
}`;

// Cards are shown through <img>, which can't load external images, so the avatar is inlined as a data URI
const fetchAvatar = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Avatar request failed with ${response.status}`);
    const type = response.headers.get('content-type') || 'image/png';
    const data = Buffer.from(await response.arrayBuffer()).toString('base64');
    return `data:${type};base64,${data}`;
}

export const getGithubProfile = async (login: string): Promise<GithubProfile> => {
    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'developer-trainer-card',
        },
        body: JSON.stringify({ query: profileQuery, variables: { login } }),
    });
    if (!response.ok) throw new Error(`GitHub request failed with ${response.status}`);

    const { data, errors } = await response.json() as ProfileQuery;
    if (errors?.some((error) => error.type === 'NOT_FOUND')) throw new GithubUserNotFoundError(login);
    if (errors || !data?.user) throw new Error(`GitHub query failed: ${errors?.map((error) => error.message).join(', ')}`);

    const { user } = data;
    return {
        id: user.databaseId,
        login: user.login,
        name: user.name,
        avatar: await fetchAvatar(user.avatarUrl),
        followers: user.followers.totalCount,
        commits: user.contributionsCollection.totalCommitContributions,
        pullRequests: user.pullRequests.totalCount,
    };
}
