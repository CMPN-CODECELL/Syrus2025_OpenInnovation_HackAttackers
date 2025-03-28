const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const cors = require('cors'); // Moved here
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express(); // Define `app` first
app.use(cors()); // Now use `cors`
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/docs/`;

const uploadToGithub = async (filePath, filename) => {
    try {
        const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

        const uploadUrl = `${GITHUB_API_URL}${filename}`;

        // Check if the file already exists on GitHub to get its sha
        let sha = null;
        try {
            const existingFileResponse = await axios.get(uploadUrl, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                },
            });
            sha = existingFileResponse.data.sha; // Get existing file SHA
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                console.error("Error checking existing file:", error.response.data);
                return null;
            }
        }

        // Upload or update file
        const response = await axios.put(uploadUrl, {
            message: `Upload ${filename}`,
            content: fileContent,
            sha: sha || undefined, // Include sha only if the file exists
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        return response.data.content.download_url;
    } catch (error) {
        console.error("GitHub Upload Error:", error.response ? error.response.data : error.message);
        return null;
    }
};


app.post('/api/upload-doc', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });
        
        const filename = req.file.originalname;
        const category = req.body.category || 'General';
        
        if (!filename.trim().toLowerCase().endsWith('.pdf')) {
            return res.status(400).json({ error: 'Only PDF files are allowed' });
        }
        
        
        const fileUrl = await uploadToGithub(req.file.path, filename);
        
        if (!fileUrl) return res.status(500).json({ error: 'Failed to upload file to GitHub' });
        
        await supabase.from('docs').insert([
            {
                name: filename,
                category,
                url: fileUrl,
                uploaded_at: new Date().toISOString()
            }
        ]);
        
        return res.status(201).json({ message: 'File uploaded successfully', file_url: fileUrl });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/api/get-docs', async (req, res) => {
    try {
        const { data, error } = await supabase.from('docs').select('*');
        if (error) throw error;
        return res.json({ docs: data || [] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/api/get-docs/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const { data, error } = await supabase.from('docs').select('*').eq('category', category);
        if (error) throw error;
        return res.json({ docs: data || [] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
