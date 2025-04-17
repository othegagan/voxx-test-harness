import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_VOXX_API_URL;

export default async function login(username: string, password: string) {

    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);

    const url = `${baseUrl}/auth/login`;

    try {
        const response = await axios.post(url, `username=${encodedUsername}&password=${encodedPassword}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                partnerId: '4BHY0E1FBCJ5D5BF'
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(`Login failed: ${error.response?.status || error.message}`);
    }
}