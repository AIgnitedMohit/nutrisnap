# NutriSnap - Image to Nutrition Calculator

NutriSnap is an AI-powered web application that analyzes food images and provides detailed nutritional information. Simply upload an image of your meal, and the app will identify food items and calculate their nutritional content.

## Features

- Image upload and capture via browser
- AI-powered food recognition 
- Detailed nutritional analysis
- Visual nutrition charts
- Responsive design for mobile and desktop

## Technology Stack

- **Frontend**: React with TypeScript
- **State Management**: React Hooks
- **Charts**: Recharts
- **AI/ML**: Google Gemini API for image analysis
- **Styling**: CSS (with potential for Tailwind CSS integration)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key (for AI capabilities)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nutrisnap.git
   cd nutrisnap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
nutrisnap/
├── public/         # Static assets
├── src/            # Source code
│   ├── components/ # React components
│   ├── services/   # API services
│   ├── styles/     # CSS stylesheets
│   ├── App.tsx     # Main application component
│   ├── index.tsx   # Application entry point
│   └── types.ts    # TypeScript type definitions
├── index.html      # HTML entry point
├── tsconfig.json   # TypeScript configuration
├── vite.config.ts  # Vite configuration
└── package.json    # Project dependencies
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Powered by Google Gemini AI
- Nutritional data is provided for informational purposes only
