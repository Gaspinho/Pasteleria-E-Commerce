# 🚀 Quick Reference - Admin Frontend

## 📦 Project Commands

```bash
# Install dependencies
npm install

# Start development server (port 3001)
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🎨 SASS Quick Reference

### Import SASS Utils
```scss
@import '../../styles/utils/variables';
@import '../../styles/utils/mixins';
```

### Responsive Breakpoints
```scss
// Max-width (mobile-first)
@include respond-to('xs') { }  // < 480px
@include respond-to('sm') { }  // < 768px
@include respond-to('md') { }  // < 992px
@include respond-to('lg') { }  // < 1200px
@include respond-to('xl') { }  // < 1400px

// Min-width (desktop-first)
@include respond-from('sm') { }  // > 768px
@include respond-from('md') { }  // > 992px
```

### Common Mixins
```scss
// Flexbox
@include flex-center;
@include flex-between;
@include flex-start;
@include flex-end;

// Transitions
@include transition(all, 0.3s, ease);

// Effects
@include hover-lift;
@include hover-scale(1.05);

// Components
@include button($bg, $color, $padding);
@include card($padding, $radius, $shadow);
```

### Design Tokens
```scss
// Colors
$primary-color     // #5550bd
$secondary-color   // #f0932b
$success-color     // #10ac84
$danger-color      // #ee5a6f

// Spacing
$spacing-xs   // 0.25rem (4px)
$spacing-sm   // 0.5rem (8px)
$spacing-md   // 1rem (16px)
$spacing-lg   // 1.5rem (24px)
$spacing-xl   // 2rem (32px)

// Typography
$font-size-xs   // 0.75rem (12px)
$font-size-sm   // 0.875rem (14px)
$font-size-base // 1rem (16px)
$font-size-lg   // 1.125rem (18px)
$font-size-xl   // 1.25rem (20px)

// Borders
$radius-sm   // 4px
$radius-md   // 8px
$radius-lg   // 12px

// Shadows
$shadow-sm, $shadow-md, $shadow-lg
```

## 🔌 API Quick Reference

### Import API Config
```javascript
import API_CONFIG, { 
  API_ENDPOINTS, 
  getAuthHeaders, 
  buildApiUrl 
} from './config/apiConfig';
```

### Fetch Example
```javascript
const response = await fetch(
  buildApiUrl(API_ENDPOINTS.PRODUCTS_LIST),
  {
    method: 'GET',
    headers: getAuthHeaders()
  }
);
const data = await response.json();
```

### Common Endpoints
```javascript
API_ENDPOINTS.LOGIN
API_ENDPOINTS.PRODUCTS_LIST
API_ENDPOINTS.PRODUCT_DETAIL(id)
API_ENDPOINTS.ORDERS_LIST
API_ENDPOINTS.ORDER_DETAIL(id)
API_ENDPOINTS.USERS_LIST
API_ENDPOINTS.FEEDBACKS_LIST
```

## 🌍 Environment Variables

### Create .env file
```env
REACT_APP_API_URL=http://127.0.0.1:8000/
REACT_APP_ENV=development
```

### Access in Code
```javascript
process.env.REACT_APP_API_URL
process.env.REACT_APP_ENV
```

## 🗄️ Backend Quick Commands

### Django Development (SQLite)
```bash
cd backend
python manage.py runserver
```

### PostgreSQL Setup
```bash
# Install adapter
pip install psycopg2-binary

# Create database
createdb pasteleria_db

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

## 📱 Responsive Grid System

### Basic Grid
```scss
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  
  @include respond-to('lg') {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to('sm') {
    grid-template-columns: 1fr;
  }
}
```

### Flexbox Grid
```scss
.flex-container {
  display: flex;
  gap: $spacing-lg;
  
  @include respond-to('md') {
    flex-direction: column;
  }
}
```

## 🎯 Common Patterns

### Card Component
```scss
.card {
  @include card($spacing-xl, $radius-lg, $shadow-md);
  @include transition(all);
  
  &:hover {
    @include hover-lift;
  }
  
  @include respond-to('sm') {
    padding: $spacing-md;
  }
}
```

### Button Component
```scss
.btn {
  @include button($primary-color, $text-light);
  
  &--secondary {
    background: $secondary-color;
  }
  
  @include respond-to('sm') {
    width: 100%;
  }
}
```

### Responsive Table
```scss
.table-container {
  overflow-x: auto;
  
  @include respond-to('md') {
    // Stack table rows on mobile
    .table thead { display: none; }
    .table tbody tr {
      display: block;
      margin-bottom: $spacing-md;
    }
  }
}
```

## 🔐 Authentication

### Store Token
```javascript
localStorage.setItem('access_token', token);
```

### Get Token
```javascript
const token = localStorage.getItem('access_token');
```

### Clear Token (Logout)
```javascript
localStorage.removeItem('access_token');
```

## 🧪 Testing Checklist

- [ ] Mobile view (375px)
- [ ] Tablet view (768px)
- [ ] Desktop view (1920px)
- [ ] Login/logout flow
- [ ] API calls working
- [ ] Forms validation
- [ ] Responsive navigation
- [ ] Table responsiveness

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README_RESPONSIVE.md` | Responsive setup guide |
| `MIGRATION_GUIDE.md` | CSS to SASS migration |
| `backend/POSTGRESQL_SETUP.md` | PostgreSQL setup |
| `IMPLEMENTATION_SUMMARY.md` | Complete summary |

## 🆘 Common Issues

### Issue: SASS not compiling
**Solution**: 
```bash
npm install sass --save-dev
npm start
```

### Issue: API not connecting
**Solution**: 
- Check backend is running
- Verify CORS settings
- Check API URL in config

### Issue: Styles not updating
**Solution**: 
- Clear browser cache (Ctrl+Shift+R)
- Check file imports
- Restart dev server

## 🎨 Color Palette

| Color | Variable | Hex |
|-------|----------|-----|
| Primary | `$primary-color` | #5550bd |
| Secondary | `$secondary-color` | #f0932b |
| Success | `$success-color` | #10ac84 |
| Danger | `$danger-color` | #ee5a6f |
| Warning | `$warning-color` | #f9ca24 |
| Info | `$info-color` | #3498db |

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables
Set in hosting platform:
- `REACT_APP_API_URL`
- `REACT_APP_ENV`

---

## 💡 Pro Tips

1. **Use SASS nesting** for cleaner code
2. **Import variables** in every SCSS file
3. **Test responsive** at each breakpoint
4. **Use mixins** instead of repeating code
5. **Keep API config** centralized
6. **Document** complex components
7. **Version control** your .env.example

---

## 📞 Support

- Check browser console for errors
- Review documentation files
- Test backend connection
- Verify environment variables

---

**Last Updated**: 2025-11-11  
**Version**: 1.0.0
