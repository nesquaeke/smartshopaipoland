import express, { Request, Response } from 'express';

const router = express.Router();

// GET /api/prices/compare - Compare prices across stores
router.get('/compare', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Porównanie cen - endpoint demo',
    data: [],
  });
});

// POST /api/prices/basket-compare - Compare basket prices
router.post('/basket-compare', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Porównanie cen koszyka - endpoint demo',
    data: null,
  });
});

export default router; 