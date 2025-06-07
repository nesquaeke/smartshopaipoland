# 🛒 SmartShopAI Poland

**AI-powered grocery price comparison platform for Poland**

[![Deploy Status](https://img.shields.io/badge/Deploy-Live-brightgreen)](https://frontend-kiza6oetm-nesquaekes-projects.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Active-blue)](https://smartshopai-backend-ete2a1nzz-nesquaekes-projects.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)

## 🌟 Features

- 🤖 **AI-Powered Price Comparison** - Smart recommendations and automated price analysis
- 🛍️ **111 Products** across **68 Polish stores** including Biedronka, LIDL, Carrefour, IKEA, Rossmann
- 💰 **Real-time Price Tracking** - Updated every 15 minutes
- 🎯 **Smart Shopping Lists** - Optimized routes and budget planning
- 📊 **Detailed Analytics** - Price trends and savings insights
- 🇵🇱 **Polish Market Focus** - Real store chains and localized pricing
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### 🎮 One-Click Launch

**For macOS/Linux:**
```bash
git clone https://github.com/nesquaeke/smartshopaipoland.git
cd smartshopaipoland
chmod +x start.sh
./start.sh
```

**For Windows:**
```cmd
git clone https://github.com/nesquaeke/smartshopaipoland.git
cd smartshopaipoland
start.bat
```

**Alternative with npm:**
```bash
git clone https://github.com/nesquaeke/smartshopaipoland.git
cd smartshopaipoland
npm install
npm run setup
npm run dev
```

### 🌐 Instant Access
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3535
- **Health Check:** http://localhost:3535/health

## 📋 Requirements

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm 8+** (comes with Node.js)
- **4GB RAM** minimum
- **Modern browser** (Chrome, Firefox, Safari, Edge)

## 🏗️ Architecture

```
smartshopaipoland/
├── 🎨 frontend/          # Next.js 15.3.2 React application
│   ├── src/app/          # App router pages
│   ├── src/components/   # Reusable components
│   └── src/config/       # API configuration
├── ⚙️ backend/           # Node.js Express API server
│   ├── src/              # Server source code
│   └── data/            # Product and store data
├── 🚀 start.sh          # Auto-setup script (macOS/Linux)
├── 🚀 start.bat         # Auto-setup script (Windows)
└── 📦 package.json      # Root project configuration
```

## 📊 Data Overview

### 🏪 **68 Stores Across Categories:**
- **Supermarkets:** Biedronka, LIDL, Carrefour, Auchan, Netto
- **Electronics:** Media Markt, Saturn, RTV Euro AGD, Neonet
- **Furniture:** IKEA, JYSK, Agata Meble
- **Drugstores:** Rossmann, Hebe, Super-Pharm, Ziko
- **DIY:** Castorama, Leroy Merlin, OBI, PSB Mrówka
- **Pet Stores:** Maxi Zoo, Kakadu, Zooplus.pl
- **Online:** Frisco.pl, Barbora, Żabka Nano
- **And many more...**

### 🛍️ **111 Products Across Categories:**
- **Electronics:** Gaming peripherals, monitors, cables, storage
- **Pet Supplies:** Food, toys, accessories, care products
- **Health & Beauty:** Vitamins, cosmetics, medical supplies
- **Home & Garden:** Tools, furniture, decoration
- **Food & Beverages:** Fresh products, pantry essentials
- **Sports & Recreation:** Equipment, clothing, accessories

## 🎯 API Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /health` | Server status and statistics | 111 products, 68 stores |
| `GET /api/products` | All products with pricing | Full product catalog |
| `GET /api/stores` | Store directory | Complete store list |
| `GET /api/products/trending` | Popular products | Best deals & promotions |
| `GET /api/products/categories` | Product categories | Organized browsing |

## 🔧 Development

### 📦 Manual Setup
```bash
# Install dependencies
npm run install-all

# Start development servers
npm run dev

# Build for production
npm run build-all

# Start production mode
npm run start:production
```

### 🐛 Troubleshooting

**Port conflicts:**
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3535 | xargs kill -9
```

**Cache issues:**
```bash
cd frontend
rm -rf .next
npm run build
```

**Dependency issues:**
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

## 🌐 Live Deployment

### Production URLs:
- **Frontend:** https://frontend-kiza6oetm-nesquaekes-projects.vercel.app
- **Backend:** https://smartshopai-backend-ete2a1nzz-nesquaekes-projects.vercel.app

### Deploy Your Own:
1. Fork this repository
2. Connect to Vercel
3. Deploy backend and frontend separately
4. Set environment variables

## 📱 Usage Examples

### 🔍 Product Search
```javascript
// Search for products
fetch('http://localhost:3535/api/products?search=mleko')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 🏪 Store Comparison
```javascript
// Get all stores
fetch('http://localhost:3535/api/stores')
  .then(res => res.json())
  .then(stores => console.log(stores));
```

### 💰 Price Analysis
```javascript
// Get trending products with price comparison
fetch('http://localhost:3535/api/products/trending')
  .then(res => res.json())
  .then(products => {
    products.forEach(product => {
      const bestPrice = Math.min(...product.prices.map(p => p.price));
      console.log(`${product.name}: ${bestPrice} zł`);
    });
  });
```

## 🎨 Screenshots

![Homepage](https://via.placeholder.com/800x400/0066cc/ffffff?text=SmartShopAI+Homepage)
*Modern homepage with AI-powered search and real-time pricing*

![Product Comparison](https://via.placeholder.com/800x400/00cc66/ffffff?text=Product+Comparison)
*Side-by-side price comparison across 68 stores*

![Store Directory](https://via.placeholder.com/800x400/cc6600/ffffff?text=Store+Directory)
*Interactive store map and directory*

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Polish Retail Data** - Accurate pricing from major Polish chains
- **Next.js Team** - Amazing React framework
- **Vercel** - Seamless deployment platform
- **OpenAI** - AI capabilities inspiration

## 📞 Support

- 🐛 **Issues:** [GitHub Issues](https://github.com/nesquaeke/smartshopaipoland/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/nesquaeke/smartshopaipoland/discussions)
- 📧 **Email:** support@smartshopai.pl

---

<div align="center">

**Made with ❤️ for the Polish shopping community**

[🌟 Star this project](https://github.com/nesquaeke/smartshopaipoland) | [🍴 Fork it](https://github.com/nesquaeke/smartshopaipoland/fork) | [📝 Report Issues](https://github.com/nesquaeke/smartshopaipoland/issues)

</div> 