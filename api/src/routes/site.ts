import express from 'express'
import path from 'path'

const router = express.Router()

router.get('/', (req, res) => {
    res.send({ Warning: 'API endpoint is /api' });
});

// Dev only: the build doesn't copy public/, and CloudFront only forwards /api/* to the Lambda
router.get('/preview', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default router
