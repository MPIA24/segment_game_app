export default async function batimentDetails(batiment_id){
    try {
        const response = await fetch(`http://localhost:8000/api/batiments/${batiment_id}`,{
            method: 'GET',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}