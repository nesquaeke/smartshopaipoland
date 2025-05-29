# SmartShopAI - Grocery Price Comparison Platform
**Powered by AI, Perfected for Savings** | Version 0.1.1

## What is SmartShopAI?

SmartShopAI is a smart grocery price comparison platform built specifically for the Polish market. I created this tool to help people save money on their daily shopping by comparing prices across Poland's major retail chains in real-time.

Living in Poland, I noticed how much prices can vary between different stores for the same products. Sometimes you could save 20-30% just by shopping at the right place! That's why I built this platform - to make price comparison effortless and help families stretch their grocery budgets further.

## Key Features

### 🛒 Smart Shopping Experience
- **Real-time price comparison** across 50+ Polish store chains
- **AI-powered recommendations** based on your shopping patterns
- **Dynamic cart with savings calculator** - see exactly how much you're saving
- **Product recommendations** tailored to your current cart
- **Dark mode support** for comfortable browsing any time of day

### 🌍 User-Friendly Interface
- **Dual language support** - Polish and English
- **Mobile-responsive design** that works on any device
- **Interactive store locator** with map integration
- **Clean, modern UI** with smooth animations

### 💰 Money-Saving Tools
- **Price tracking alerts** - get notified when prices drop
- **Promotion detection** - never miss a deal again
- **Shopping list optimization** - find the best store combinations
- **Savings analytics** - track your monthly savings

### 🏪 Comprehensive Store Coverage
We track prices from all major Polish retail chains:
- **Discount stores**: Biedronka, LIDL, Netto, Dino
- **Hypermarkets**: Carrefour, Auchan, Tesco, Kaufland
- **Convenience stores**: Żabka, Freshmarket, Lewiatan
- **Specialized retailers**: IKEA, Media Markt, Decathlon, H&M
- **Petrol stations**: Orlen, BP, Shell

## Technology Stack

**Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
**Backend**: Node.js, Express.js
**Features**: RESTful API, Real-time data processing, Mobile-responsive design

## Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smartshopai
   cd smartshopai
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   The API will start running on `http://localhost:3535`

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The web app will open at `http://localhost:3000`

## API Documentation

### Main Endpoints

- `GET /health` - Check API status
- `GET /api/products` - Get all products with filters
- `GET /api/stores` - Get store information
- `GET /api/products/trending` - Get trending/promoted products
- `POST /api/cart/add` - Add item to shopping cart
- `POST /api/favorites/add` - Add item to favorites

### Example API Usage

```javascript
// Get products by category
fetch('http://localhost:3535/api/products?category=2&limit=10')
  .then(response => response.json())
  .then(data => console.log(data));

// Search for products
fetch('http://localhost:3535/api/products?search=milk&sort=price')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Data & Pricing

All product prices and store information are based on real Polish market data. Prices are updated regularly to ensure accuracy. The platform includes:

- **110+ products** across 19 categories
- **Real Polish pricing** from actual stores
- **Authentic promotions** and discount tracking
- **Accurate store locations** and opening hours

## Contributing

I welcome contributions from other developers! Here's how you can help:

1. **Report bugs** - Found something that doesn't work? Please let me know
2. **Suggest features** - Have ideas for improvements? I'd love to hear them
3. **Submit pull requests** - Code contributions are always appreciated
4. **Improve documentation** - Help make the project more accessible

## Future Roadmap

- **Mobile app** for iOS and Android
- **Barcode scanning** for instant product lookup
- **User accounts** with personalized dashboards
- **Social features** for sharing deals with friends
- **Advanced analytics** for spending patterns
- **Store partnership integration** for exclusive deals

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Built with ❤️ for the Polish community. If you have questions, suggestions, or just want to say hello, feel free to reach out!

---

*SmartShopAI v0.1.1 - Making grocery shopping smarter, one comparison at a time.* 