"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// Endpoint to check server status
app.get('/ping', (req, res) => {
    res.send(true);
});
// Endpoint to submit form data
app.post('/submit', (req, res) => {
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
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    // Path to the JSON file
    const dbPath = path.join(__dirname, 'db.json');
    // Read existing submissions
    if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        const submissions = JSON.parse(fileContent) || [];
        if (index >= 0 && index < submissions.length) {
            res.json(submissions[index]);
        }
        else {
            res.status(404).send('Submission not found');
        }
    }
    else {
        res.status(404).send('No submissions found');
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
