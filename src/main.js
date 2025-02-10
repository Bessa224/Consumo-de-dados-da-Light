// main.js
const express = require('express');
const seleniumService = require('../src/services/selenium');
const app = express();

app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({status: 'Server is running'});
});

// Example endpoint that performs a web search
app.post('/scrape', async (req, res) => {
    try {
        const {url, searchTerm} = req.body;
        if (!url || !searchTerm) {
            return res.status(400).json({
                error: 'URL and search term are required'
            });
        }

        const result = await seleniumService.performSearch(url, searchTerm);
        res.json(result);
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({
            error: 'Failed to perform scraping operation'
        });
    }
});

// Example endpoint for taking screenshots
app.post('/screenshot', async (req, res) => {
    try {
        const {url} = req.body;
        if (!url) {
            return res.status(400).json({
                error: 'URL is required'
            });
        }

        const result = await seleniumService.takeScreenshot(url);
        res.setHeader('Content-Type', result.contentType);
        res.send(result.screenshot);
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({
            error: 'Failed to take screenshot'
        });
    }
});
app.post('/loginLight',async (req, res) => {
    try {
        const {url,username,password} = req.body;
        if (!url) {
            return res.status(400).json({
                error: 'URL is required'
            });
        }

         const result =  await seleniumService.performLogin(url,username,password);
         res.json(result)
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({
            error: 'Failed to take screenshot'
        });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something broke!'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});