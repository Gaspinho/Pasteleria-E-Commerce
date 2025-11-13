# Migration Guide: CSS to SASS

## Overview

This guide explains the migration from CSS to SASS in the admin_frontend, making it responsive and aligned with the customer-frontend architecture.

---

## What Changed

### 1. **SASS Installation**

Added SASS support to the project:
```bash
npm install sass --save-dev
```

### 2. **New SASS Structure**

Created modular SASS architecture:
```
src/styles/
├── main.scss              # Entry point (imported in index.js)
├── utils/
│   ├── _variables.scss    # Colors, spacing, breakpoints
│   └── _mixins.scss       # Responsive mixins, utilities
├── base/
│   └── _reset.scss        # CSS reset
├── layout/
│   ├── _header.scss       # Responsive header
│   ├── _sidebar.scss      # Responsive sidebar
│   └── _applayout.scss    # Main layout
├── components/
│   ├── _buttons.scss
│   ├── _cards.scss
│   ├── _dropdown.scss
│   ├── _forms.scss
│   ├── _tables.scss
│   └── _toolbar.scss
└── pages/
    ├── _dashboard.scss
    └── ...
```

### 3. **Index.js Updated**

Changed from CSS import to SASS:
```javascript
// Before
import "./index.css";

// After
import "./styles/main.scss";
```

### 4. **API Configuration Centralized**

Created `src/config/apiConfig.js` for centralized backend configuration:
- Supports both SQLite (development) and PostgreSQL (production)
- Environment-based configuration
- Reusable API endpoints

---

## Using SASS in Components

### Old Way (CSS)
```javascript
import './component.css';

function Component() {
  return <div className="container">...</div>;
}
```

### New Way (SASS - Option 1: Keep using existing CSS)
```javascript
// Keep your existing CSS files - they still work!
import './component.css';

function Component() {
  return <div className="container">...</div>;
}
```

### New Way (SASS - Option 2: Convert to SCSS)
```javascript
import './component.scss';

function Component() {
  return <div className="container">...</div>;
}
```

---

## Converting CSS Files to SCSS

### Example: Converting a Component

**Before (component.css):**
```css
.card {
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 20px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .card {
    padding: 15px;
  }
}
```

**After (component.scss):**
```scss
@import '../../styles/utils/variables';
@import '../../styles/utils/mixins';

.card {
  padding: $spacing-xl;
  border-radius: $radius-lg;
  background: $bg-light;
  box-shadow: $shadow-sm;
  
  &-title {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }
  
  @include respond-to('sm') {
    padding: $spacing-lg;
  }
}
```

### Benefits of SCSS:
- **Variables**: Consistent colors, spacing, fonts
- **Nesting**: Cleaner, more organized code
- **Mixins**: Reusable responsive breakpoints
- **Calculations**: `$spacing-xl * 2`

---

## Responsive Design Patterns

### Using Breakpoint Mixins

```scss
.component {
  padding: $spacing-xl;
  
  // Tablet and below
  @include respond-to('md') {
    padding: $spacing-lg;
  }
  
  // Mobile
  @include respond-to('sm') {
    padding: $spacing-sm;
  }
}
```

### Grid Layouts

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-xl;
  
  @include respond-to('lg') {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to('sm') {
    grid-template-columns: 1fr;
  }
}
```

### Flexible Cards

```scss
.card-container {
  display: flex;
  gap: $spacing-lg;
  
  @include respond-to('md') {
    flex-direction: column;
  }
}
```

---

## Component Examples

### Button Component

```scss
@import '../../styles/utils/variables';
@import '../../styles/utils/mixins';

.btn {
  @include button($primary-color, $text-light, $spacing-sm $spacing-lg);
  
  &--secondary {
    background-color: $secondary-color;
  }
  
  &--sm {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-sm;
  }
  
  @include respond-to('sm') {
    width: 100%;
  }
}
```

### Table Component

```scss
.table-container {
  overflow-x: auto;
  
  @include respond-to('md') {
    .table {
      thead {
        display: none; // Hide headers on mobile
      }
      
      tbody tr {
        display: block;
        margin-bottom: $spacing-md;
        
        td {
          display: flex;
          justify-content: space-between;
          
          &::before {
            content: attr(data-label);
            font-weight: $font-weight-bold;
          }
        }
      }
    }
  }
}
```

---

## Backend Connection

### SQLite (Development)

Default configuration in `src/config/apiConfig.js`:
```javascript
const DEV_CONFIG = {
  baseURL: 'http://127.0.0.1:8000/',
};
```

### PostgreSQL (Production)

1. **Create .env file:**
```env
REACT_APP_API_URL=https://api.yourapp.com/
REACT_APP_ENV=production
```

2. **Backend setup:**
   - Follow `backend/POSTGRESQL_SETUP.md`
   - Update Django settings
   - Run migrations

3. **Build and deploy:**
```bash
npm run build
```

---

## CSS Variables Still Work!

Your existing CSS variables in `index.css` are still active:
```css
:root {
  --color-primery: #DA627D;
  --color-secondry: #A53860;
  --sidebar-width: 300px;
  /* etc... */
}
```

These can be used alongside SASS variables:
```scss
.component {
  // SASS variable
  padding: $spacing-xl;
  
  // CSS variable (from index.css)
  color: var(--color-primery);
}
```

---

## Gradual Migration Strategy

You don't need to convert everything at once!

### Phase 1: Keep existing CSS ✅ (Current)
- All existing CSS files continue to work
- SASS structure is ready
- New components can use SASS

### Phase 2: Convert layouts (Optional)
- Convert header.css → _header.scss
- Convert toolbar.css → _sidebar.scss
- Use responsive mixins

### Phase 3: Convert components (Optional)
- Gradually convert component CSS to SCSS
- Use variables and mixins
- Add responsive behavior

### Phase 4: Convert pages (Optional)
- Convert page-specific CSS
- Implement responsive grids
- Optimize for mobile

---

## Testing Responsive Design

### Browser DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - iPhone SE: 375px
   - iPad: 768px
   - Desktop: 1920px

### Manual Testing
```scss
// Add border to see layout
* {
  border: 1px solid red !important;
}
```

---

## Common SASS Patterns

### Nested Selectors
```scss
.card {
  background: white;
  
  &__header {
    border-bottom: 1px solid $border-color;
  }
  
  &__body {
    padding: $spacing-md;
  }
  
  &--highlighted {
    border: 2px solid $primary-color;
  }
  
  &:hover {
    box-shadow: $shadow-lg;
  }
}
```

### Using Mixins
```scss
.button {
  @include button($primary-color, $text-light);
  @include transition(all);
  @include hover-lift;
  
  @include respond-to('sm') {
    width: 100%;
  }
}
```

### Calculations
```scss
.sidebar {
  width: $sidebar-width;
  
  &.collapsed {
    width: $sidebar-collapsed-width;
  }
}

.content {
  padding-left: $sidebar-width;
  
  &.sidebar-collapsed {
    padding-left: $sidebar-collapsed-width;
  }
}
```

---

## Resources

- **SASS Documentation**: https://sass-lang.com/documentation
- **Customer Frontend**: Reference `customer-frontend/src/styles/` for patterns
- **Backend Setup**: `backend/POSTGRESQL_SETUP.md`
- **API Config**: `src/config/apiConfig.js`

---

## Support

If you encounter issues:
1. Check browser console for SASS compilation errors
2. Verify SASS is installed: `npm list sass`
3. Clear cache: `npm start` (it will rebuild)
4. Check file paths in imports

---

## Summary

✅ SASS is installed and configured  
✅ Responsive mixins are available  
✅ Existing CSS files still work  
✅ Backend supports both SQLite and PostgreSQL  
✅ API configuration is centralized  
✅ Mobile-first responsive design implemented  

You can start using SASS features in new components while keeping existing CSS files unchanged!
