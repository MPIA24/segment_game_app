export default async function registerRequest (name,email,password,password_confirmation){
    try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name" : name,
                "email" : email,
                "password" : password,
                "password_confirmation" : password_confirmation
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