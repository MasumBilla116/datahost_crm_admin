import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      const response = await fetch(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const accessCodes = result.data?.access_codes;
      const roleId = result.data?.role_id;
      

      // Read existing JSON file content
    //   let existingData;
    //   try {
    //     const existingFilePath = `user_data/${roleName}.json`;
    //     existingData = JSON.parse(fs.readFileSync(existingFilePath, 'utf8'));
    //   } catch (error) {
    //     existingData = { access_codes: [] };
    //   }

      // Remove codes not present in new accessCodes
    //   existingData.access_codes = existingData.access_codes.filter(code => accessCodes.includes(code));

    //   // Add new codes
    //   accessCodes.forEach(code => {
    //     if (!existingData.access_codes.includes(code)) {
    //       existingData.access_codes.push(code);
    //     }
    //   });

      // Write updated data to JSON file
      const jsonString = JSON.stringify(accessCodes, null, 2);
      const filePath = `user_data/${roleId}.json`;
      fs.writeFileSync(filePath, jsonString, 'utf8');


      res.status(200).json({ success: true, message: "Login successful",data:result });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
