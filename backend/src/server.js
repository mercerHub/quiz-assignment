import app from './app.js';
  

import dotenv from 'dotenv';
const port = 3000;
dotenv.config({
    path: './.env'
});

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});
