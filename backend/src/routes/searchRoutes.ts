import express, { Request, Response } from 'express';

const router = express.Router();

// POST /api/search - Global search
router.post('/', (req: Request, res: Response) => {
  const { query } = req.body;
  
  res.status(200).json({
    success: true,
    message: 'Wyszukiwanie zakończone pomyślnie',
    data: {
      products: [],
      stores: [],
      total_products: 0,
      total_stores: 0,
      search_query: query
    }
  });
});

// GET /api/search/suggestions - Search suggestions
router.get('/suggestions', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Search suggestions - Coming soon',
    data: [],
  });
});

export default router; 