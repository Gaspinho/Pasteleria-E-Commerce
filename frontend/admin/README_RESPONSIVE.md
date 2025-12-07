# Admin Frontend - Responsive Dashboard

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Responsive Design](#responsive-design)
- [SASS Architecture](#sass-architecture)
- [Setup Instructions](#setup-instructions)
- [Backend Configuration](#backend-configuration)
- [PostgreSQL Setup](#postgresql-setup)
- [Deployment](#deployment)

---

## ✨ Features

- ✅ Fully responsive admin dashboard
- ✅ SASS-based styling with modular architecture
- ✅ Mobile-first responsive design
- ✅ JWT authentication
- ✅ Product management
- ✅ Order tracking
- ✅ Customer management
- ✅ Custom cake design tool
- ✅ Feedback system
- ✅ Dashboard analytics
- ✅ Staff management

---

## 🛠 Tech Stack

- **React 18** - UI Framework
- **Redux Toolkit** - State Management
- **RTK Query** - Data Fetching
- **SASS/SCSS** - Styling
- **React Router v6** - Routing
- **Material-UI** - Component Library
- **Recharts** - Data Visualization

---

## 📱 Responsive Design

The admin panel is built with a mobile-first approach and is fully responsive across all devices:

### Breakpoints

```scss
$breakpoint-xs: 480px;   // Mobile phones
$breakpoint-sm: 768px;   // Tablets (portrait)
$breakpoint-md: 992px;   // Tablets (landscape)
$breakpoint-lg: 1200px;  // Laptops
$breakpoint-xl: 1400px;  // Desktop
$breakpoint-xxl: 1600px; // Large Desktop
```

### Responsive Features

- **Collapsible sidebar** on mobile/tablet
- **Stacked tables** on small screens
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly buttons** and controls
- **Optimized navigation** for mobile

---

## 🎨 SASS Architecture

The project uses a modular SASS architecture inspired by customer-frontend:

```
src/styles/
├── main.scss              # Main entry point
├── utils/
│   ├── _variables.scss    # Colors, spacing, breakpoints
│   └── _mixins.scss       # Reusable SASS mixins
├── base/
│   └── _reset.scss        # CSS reset and base styles
├── layout/
│   ├── _header.scss       # Header component
│   ├── _sidebar.scss      # Sidebar/navigation
│   └── _applayout.scss    # Main layout structure
├── components/
│   ├── _buttons.scss      # Button styles
│   ├── _cards.scss        # Card components
│   ├── _dropdown.scss     # Dropdown menus
│   ├── _forms.scss        # Form elements
│   ├── _tables.scss       # Table styles
│   └── _toolbar.scss      # Toolbar component
└── pages/
    ├── _dashboard.scss    # Dashboard page
    ├── _customers.scss    # Customers page
    ├── _products.scss     # Products page
    ├── _orders.scss       # Orders page
    └── ...
```

### Key Mixins

```scss
// Responsive breakpoints
@include respond-to('sm') { ... }   // Max-width
@include respond-from('md') { ... } // Min-width

// Flexbox utilities
@include flex-center;
@include flex-between;

// Transitions
@include transition(all, 0.3s, ease);

// Card component
@include card($spacing-xl, $radius-lg, $shadow-md);

// Button component
@include button($primary-color, $text-light, $spacing-sm $spacing-lg);
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 14+ and npm
- Backend server running (Django)

### Installation

1. **Clone the repository**
   ```bash
   cd admin_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

The app will run on `http://localhost:3001`

---

## 🔌 Backend Configuration

### SQLite Backend (Development)

By default, the app connects to the Django backend using SQLite:

```javascript
// src/config/apiConfig.js
const DEV_CONFIG = {
  baseURL: 'http://127.0.0.1:8000/',
};
```

### Environment Variables

Create a `.env` file in the admin_frontend root:

```env
# Development (SQLite)
REACT_APP_API_URL=http://127.0.0.1:8000/
REACT_APP_ENV=development

# Production (PostgreSQL)
REACT_APP_API_URL=https://api.yourapp.com/
REACT_APP_ENV=production
```

### API Configuration

All API endpoints are centralized in `src/config/apiConfig.js`:

```javascript
import API_CONFIG, { API_ENDPOINTS, getAuthHeaders } from './config/apiConfig';

// Usage example
const response = await fetch(
  buildApiUrl(API_ENDPOINTS.PRODUCTS_LIST),
  { headers: getAuthHeaders() }
);
```

---

## 🐘 PostgreSQL Setup

### Backend Migration

1. **Install PostgreSQL adapter**
   ```bash
   cd backend
   pip install psycopg2-binary
   ```

2. **Update Django settings.py**
   
   Uncomment the PostgreSQL configuration in `backend/settings.py`:
   
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'pasteleria_db',
           'USER': 'postgres',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. **Update CORS settings**
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://localhost:3001",
       "https://your-production-domain.com",
   ]
   ```

For detailed PostgreSQL setup instructions, see:
- **Backend**: `backend/POSTGRESQL_SETUP.md`

### Frontend Configuration

Update `.env` file:

```env
REACT_APP_API_URL=https://your-postgresql-backend.com/api/
REACT_APP_ENV=production
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Build the app: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify:
   - `REACT_APP_API_URL`: Your backend API URL
   - `REACT_APP_ENV`: production

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Deploy to AWS S3 + CloudFront

1. Build: `npm run build`
2. Upload `build` folder to S3 bucket
3. Configure CloudFront distribution
4. Update CORS in backend

---

## 📖 Additional Documentation

- **Backend PostgreSQL Setup**: `../backend/POSTGRESQL_SETUP.md`
- **API Configuration**: `src/config/apiConfig.js`
- **SASS Variables**: `src/styles/utils/_variables.scss`
- **SASS Mixins**: `src/styles/utils/_mixins.scss`

---

## 🎯 Responsive Testing

Test the responsive design at different breakpoints:

- **Mobile**: 375px - 480px
- **Tablet**: 768px - 992px
- **Desktop**: 1200px+

Use browser DevTools (F12) to test different screen sizes.

---

## 🤝 Support

For issues or questions:
1. Check console for errors
2. Verify backend is running
3. Check API configuration
4. Review CORS settings

---

## 📝 License

This project is part of the Pasteleria E-Commerce system.
