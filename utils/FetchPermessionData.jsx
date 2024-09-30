import fs from 'fs';

async function FetchPermessionData(decryptedRoleId) {
  
    try {
        // Assuming the roleId directly maps to the filename
        const filePath = `user_data/${decryptedRoleId}.json`;
        
        // Read the data from the file
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Parse the JSON data
        const jsonData = JSON.parse(data);
        
        return jsonData;
    } catch (error) {
        
        return null;
    }
}

export default FetchPermessionData;
