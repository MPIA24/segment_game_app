export default async function batimentsRequest(){
    try {
        const response = await fetch('http://localhost:8000/api/batiments',{
            method: 'GET',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}