import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to check server status
app.get('/ping', (req: Request, res: Response) => {
  res.send(true);
});

// Endpoint to submit form data
app.post('/submit', (req: Request, res: Response) => {
  const data = req.body;

  // Path to the JSON file
  const dbPath = path.join(__dirname, 'db.json');

  // Read existing submissions
  let submissions = [];
  if (fs.existsSync(dbPath)) {
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    submissions = JSON.parse(fileContent) || [];
  }

  // Add new submission
  submissions.push(data);

  // Write updated submissions back to file
  fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));

  res.send('Form submitted!');
});

// Endpoint to read form submissions by index
app.get('/read', (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);

  // Path to the JSON file
  const dbPath = path.join(__dirname, 'db.json');

  // Read existing submissions
  if (fs.existsSync(dbPath)) {
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    const submissions = JSON.parse(fileContent) || [];

    if (index >= 0 && index < submissions.length) {
      res.json(submissions[index]);
    } else {
      res.status(404).send('Submission not found');
    }
  } else {
    res.status(404).send('No submissions found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
