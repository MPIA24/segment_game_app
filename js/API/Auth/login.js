export default async function loginRequest(mail,password) {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email" : mail,
                "password" : password
            })
        });

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}