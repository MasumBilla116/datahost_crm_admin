// import fs from 'fs';

// export default function handler(req, res) {
//   const { roleId } = req.query;
//   const filePath = `user_data/1.json`;

//   try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const jsonData = JSON.parse(data);
//     res.status(200).json(jsonData);
//   } catch (error) {
//     console.error('Error reading file:', error);
//     res.status(500).json({ error: 'Error reading file' });
//   }
// }



// api/getPermissionData.js

import fs from 'fs';

export default function handler(req, res) {
  const { roleId } = req.query;
  const filePath = `user_data/${roleId}.json`;

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Error reading file' });
  }
}
