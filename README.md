# 🍎 SustainaBite
Second place winner @ Vibe the Code ElleHacks 2025

SustainaBite is a circular economy food platform that optimizes the connection between local farmers, businesses, and consumers by utilizing artificial intelligence to minimize food waste and streamline regional delivery logistics.
- [DevPost](https://devpost.com/software/sustainabite-of4zcx)
- [Vercel](https://sustainabite-seven.vercel.app/)

---

## 🌍 Overview
SustainaBite is a multi-role digital ecosystem designed to optimize the farm-to-table pipeline. It utilizes high-frequency data processing and the Gemini 2.5 Flash model to dynamically manage perishable inventory. By implementing a circular economy model, the platform intelligently identifies surplus products near their peak ripeness or expiration and promotes them to consumers via "Rescue Mode" discounts. The architecture integrates real-time geolocation services and automated logistics to ensure that local food resources are utilized efficiently, reducing environmental impact and supporting regional food security.

---

## ✨ Key Features
- 🤖 **AI-Powered "Food Buddy" Assistant**: A specialized chatbot leveraging the Gemini API with Google Maps grounding to provide recipe suggestions based on current inventory, local search, and business optimization insights.
- 👥 **Triple-Role Ecosystem**: 
  - 🛒 **Consumers**: Browse local marketplaces, track live deliveries, and access eco-discounts.
  - 🚜 **Businesses**: Manage real-time inventory, monitor sales analytics/profit margins, and handle incoming orders.
  - 🚚 **Drivers**: Access a live job board to accept delivery tasks with navigation assistance and status tracking.
- ⏰ **Dynamic "Rescue Mode"**: A togglable marketplace filter that highlights surplus inventory at significant discounts to prevent food waste.
- 📈 **Profit & Sales Analytics**: Comprehensive dashboards for producers to track total revenue, top-selling items, and customer trends.
- 📱 **Modern Responsive UI**: A mobile-first design featuring custom theme support (Light/Dark mode) and high-performance state management.

---

## ⚠️ The Problem
Global food systems suffer from significant "last-mile" inefficiencies where local producers often discard up to 30% of their yield due to oversupply or minor cosmetic imperfections. Simultaneously, consumers face rising food costs and a lack of transparency in local sourcing. SustainaBite solves this by:
- **Monetizing Surplus**: Providing a secondary market for "ugly" or day-old produce.
- **Reducing Friction**: Automating the connection between producers, couriers, and buyers.
- **Educational Incentives**: Using AI to teach consumers how to cook with available local ingredients, rather than relying on processed imports.

---

## 🛠️ Tech Stack
**Frontend**:
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
**AI Integration**: 
- Google Gemini 2.5 Flash API
**Architecture**: 
- ES6 Modules with Import Maps

---

## 🚀 How to Run
### Prerequisites
- Node.js (v18 or higher)
- Google Gemini API key

### Installation
```bash
# Clone the repository
git clone https://github.com/sutr4/sustainabite
cd sustainabite

# Install dependencies
npm install
```
Environment Setup:
Create a `.env` file in the root directory and add your Google AI Studio API Key:
```env
API_KEY=your_gemini_api_key_here
```
Start your development server:
```bash
npm run dev
```

---

## ⚙️ How It Works
1.  **Authentication**: Users register as a Consumer, Business, or Driver. Roles are strictly enforced to tailor the UI/UX.
2.  **Inventory Sync**: Businesses post products. The GeminiService automatically scrapes this inventory to update the AI's "system instruction" context.
3.  **Intelligent Chat**: When a consumer asks for a recipe, the AI checks the *actual* products currently listed by local farms and suggests ingredients they can buy immediately.
4.  **Order Lifecycle**:
    *   **Order Placed**: Consumer checks out; order status becomes `CONFIRMED`.
    *   **Preparation**: Business accepts and moves order to `PREPARING`.
    *   **Logistics**: If delivery, the order appears on the Driver's job board.
    *   **Fulfillment**: Driver marks as `ON_THE_WAY` (triggering live tracking for the customer) and finally `DELIVERED`.

---

## 🧠 What We Learned
*   **Contextual AI Engineering**: How to use RAG-like (Retrieval-Augmented Generation) patterns by injecting real-time inventory data into system instructions to keep AI responses grounded and helpful.
*   **Cross-Role UX Design**: Managing complex states where one user's action (Business preparing food) must reflect instantly across other interfaces (Consumer's tracking map and Driver's job board).
*   **Sustainability Logistics**: Designing systems that prioritize waste reduction through UI cues like "Rescue Mode" to nudge user behavior toward more eco-friendly choices.

---

## 👥 Team
- **Tracy Su** - [GitHub](https://github.com/sutr4) | [LinkedIn](https://linkedin.com/in/tracysu6)
- **Khushi Maan** - [GitHub](https://github.com/Khusheemaan) | [LinkedIn](https://www.linkedin.com/in/khushi-maan-729a89284/)
- **Aqeelah Ghadiyali** - [LinkedIn](https://www.linkedin.com/in/aqeelah-ghadiyali-202410362/)

---

## 🙏 Acknowledgments
- Thanks to [ElleHacks](https://ellehacks.com/) for hosting this amazing hackathon!