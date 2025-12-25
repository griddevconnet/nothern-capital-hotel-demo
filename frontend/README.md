# Northern Capital Hotel - Frontend

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.22.0-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![React Query](https://img.shields.io/badge/React_Query-5.0.0-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![ESLint](https://img.shields.io/badge/ESLint-8.56.0-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.1.0-F7B93E?logo=prettier&logoColor=white)](https://prettier.io/)

Modern, responsive, and accessible frontend for Northern Capital Hotel's booking platform. Built with React, Vite, and Tailwind CSS.

## ✨ Features

- 🚀 Blazing fast development with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 🔄 State management with React Query
- 🛣️ Client-side routing with React Router
- 🌓 Dark mode support
- 📱 Fully responsive design
- ♿ WCAG 2.1 AA accessible
- 📊 Google Analytics integration
- 🧪 Comprehensive test coverage
- 🛠 Developer tooling (ESLint, Prettier, Husky)
- 🔍 SEO optimized
- 🚀 Performance optimized

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm 9.0.0 or later (or pnpm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/northern-capital-hotel.git
   cd northern-capital-hotel/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your configuration.

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

### Testing

Run unit tests:

```bash
npm test
# or
yarn test
# or
pnpm test
```

Run tests in watch mode:

```bash
npm test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

### Formatting

```bash
# Check formatting
npm run format:check

# Format files
npm run format:write
```

## 🏗 Project Structure

```
src/
├── assets/            # Static assets (images, fonts, etc.)
├── components/        # Reusable UI components
│   ├── common/        # Common components (buttons, inputs, etc.)
│   ├── layout/        # Layout components (header, footer, etc.)
│   └── ui/            # Base UI components
├── config/            # Application configuration
├── constants/         # Application constants
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── routes/            # Route configurations
├── services/          # API and service integrations
│   ├── api/           # API clients
│   └── analytics/     # Analytics services
├── styles/            # Global styles and Tailwind configuration
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.js             # Main application component
```

## 🧩 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: React Query 5
- **Routing**: React Router 6
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **API**: Axios
- **Analytics**: Google Analytics

## 📝 Code Style

This project uses:

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting
- [Husky](https://typicode.github.io/husky/) for git hooks
- [lint-staged](https://github.com/okonet/lint-staged) for running linters on git staged files

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the UI library
- [React Icons](https://react-icons.github.io/react-icons/) for the icon library
- [Framer Motion](https://www.framer.com/motion/) for animations
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
