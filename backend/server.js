import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();
import db from './src/db/db.js';
import dns from 'dns'
import cors from 'cors';



// Use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

db()


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});