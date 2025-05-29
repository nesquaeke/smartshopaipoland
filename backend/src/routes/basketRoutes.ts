import express, { Request, Response } from 'express';

const router = express.Router();

// GET /api/baskets - Get user baskets (demo)
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Koszyki pobrane pomyślnie',
    data: [],
    meta: {
      total: 0
    }
  });
});

// POST /api/baskets - Create new basket
router.post('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Create basket - Coming soon',
    data: null,
  });
});

// GET /api/baskets/:id/optimize - Get optimized shopping plan
router.get('/:id/optimize', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Basket optimization - Coming soon',
    data: null,
  });
});

export default router; 