# 💡 Responsive Implementation Examples

## Real-World Code Examples from Admin Frontend

---

## 📐 Grid Layouts

### Example 1: Product Grid (Auto-fit Pattern)
**File**: `_products.scss`

```scss
.productGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: $spacing-xl;
  padding: $spacing-lg;
  
  // Tablet - force 2 columns max
  @include respond-to('lg') {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
  }
  
  // Mobile - single column
  @include respond-to('md') {
    grid-template-columns: 1fr;
    padding: $spacing-md;
  }
}
```

**Result**: 
- Desktop (1920px): 3 products per row
- Laptop (1366px): 2 products per row
- Mobile (768px): 1 product per row

---

### Example 2: Dashboard Featured Cards (Explicit Columns)
**File**: `_dashboard.scss`

```scss
.featuredContainer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-xl;
  
  @include respond-to('lg') {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
  }
  
  @include respond-to('md') {
    grid-template-columns: 1fr;
  }
}
```

**Result**: Precise control over column counts at each breakpoint

---

## ✂️ Text Truncation Examples

### Example 3: Dashboard Username (Single Line)
**File**: `_dashboard.scss`

```scss
.widgetSmListItemName {
  font-weight: $font-weight-semibold;
  @include text-truncate;
  max-width: 150px;
  
  @include respond-to('lg') {
    max-width: 120px;
  }
  
  @include respond-to('md') {
    max-width: 100px;
  }
}
```

**HTML**:
```html
<div class="widgetSmListItemName">
  Christopher Anderson
</div>
```

**Result**:
- Desktop: "Christopher Anders..."
- Tablet: "Christopher An..."
- Mobile: "Christophe..."

---

### Example 4: Product Description (Multi-Line)
**File**: `_products.scss`

```scss
.productDescription {
  font-size: $font-size-base;
  color: $text-secondary;
  @include line-clamp(3);
  line-height: 1.6;
  margin-bottom: $spacing-md;
  
  @include respond-to('md') {
    @include line-clamp(2);
    font-size: $font-size-sm;
  }
}
```

**HTML**:
```html
<p class="productDescription">
  A delicious chocolate cake with rich frosting and beautiful decorations. 
  Perfect for birthdays, anniversaries, or any special celebration. 
  Made with premium ingredients and baked fresh daily.
</p>
```

**Result**:
- Desktop: Shows 3 lines with ellipsis
- Mobile: Shows 2 lines with ellipsis

---

### Example 5: Flex Container with Text Truncation
**File**: `_customers.scss`

```scss
.userListUser {
  @include flex-center;
  gap: $spacing-sm;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: $radius-full;
    flex-shrink: 0; // Prevent avatar squishing
  }
  
  span {
    @include text-truncate;
    max-width: 200px;
    min-width: 0; // Critical for flex truncation
    
    @include respond-to('lg') {
      max-width: 150px;
    }
    
    @include respond-to('md') {
      max-width: 120px;
    }
  }
}
```

**HTML**:
```html
<div class="userListUser">
  <img src="/avatar.jpg" alt="User" />
  <span>elizabeth.anderson@email.com</span>
</div>
```

**Result**: Avatar stays 40px, text truncates at specified widths

---

## 🖼️ Image Handling

### Example 6: Responsive Avatar Sizes
**File**: `_orders.scss`

```scss
.image {
  position: absolute;
  width: 150px;
  height: 150px;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: $radius-full;
  object-fit: cover;
  border: 4px solid $bg-light;
  box-shadow: $shadow-md;
  
  @include respond-to('md') {
    width: 130px;
    height: 130px;
    top: -35px;
  }
  
  @include respond-to('sm') {
    width: 110px;
    height: 110px;
    top: -30px;
    border: 3px solid $bg-light;
  }
}
```

**Result**: Avatar scales smoothly from 150px → 130px → 110px

---

### Example 7: Product Photo Container
**File**: `_products.scss`

```scss
.photo-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: $radius-lg;
  margin-bottom: $spacing-lg;
  background-color: $bg-hover;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    @include transition(transform);
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  @include respond-to('md') {
    height: 250px;
  }
  
  @include respond-to('sm') {
    height: 200px;
  }
}
```

**Result**: Container maintains aspect ratio, image scales on hover

---

## 🎴 Card Components

### Example 8: Order Card
**File**: `_orders.scss`

```scss
.card {
  width: 100%;
  max-width: 400px;
  min-height: 430px;
  background-color: $bg-light;
  border-radius: $radius-xl;
  padding: $spacing-xl;
  padding-top: 80px;
  position: relative;
  box-shadow: $shadow-lg;
  @include transition(all);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-xl;
  }
  
  @include respond-to('lg') {
    max-width: 100%; // Full width in grid
  }
  
  @include respond-to('md') {
    padding: $spacing-lg;
    padding-top: 70px;
    min-height: 400px;
  }
  
  @include respond-to('sm') {
    padding: $spacing-md;
    padding-top: 60px;
    min-height: 350px;
    border-radius: $radius-lg;
  }
}
```

**Result**: Card adapts padding and height based on screen size

---

## 🔘 Button Patterns

### Example 9: Responsive Button Group
**File**: `_orders.scss`

```scss
.buttons {
  @include flex-center;
  gap: $spacing-md;
  flex-wrap: wrap;
  padding-top: $spacing-md;
  border-top: 1px solid $border-light;
  
  @include respond-to('sm') {
    gap: $spacing-sm;
    flex-direction: column; // Stack vertically
  }
}

.button {
  @include button($secondary-color, $text-light, $spacing-sm $spacing-xl);
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  white-space: nowrap;
  
  @include respond-to('md') {
    padding: $spacing-xs $spacing-lg;
    font-size: $font-size-sm;
  }
  
  @include respond-to('sm') {
    width: 100%; // Full width on mobile
    padding: $spacing-xs $spacing-md;
  }
}
```

**HTML**:
```html
<div class="buttons">
  <button class="button view">View</button>
  <button class="button edit">Edit</button>
  <button class="button delete">Delete</button>
</div>
```

**Result**: Buttons in row on desktop, stack vertically full-width on mobile

---

## 📊 Table/DataGrid Patterns

### Example 10: Responsive DataGrid Wrapper
**File**: `_customers.scss`

```scss
.userList {
  flex: 4;
  width: 100%;
  background-color: $bg-secondary;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md;
  
  // DataGrid container
  .MuiDataGrid-root {
    border: none;
    min-width: 600px; // Prevent columns from collapsing
    
    @include respond-to('lg') {
      min-width: 500px;
    }
  }
  
  // Wrapper for horizontal scroll
  &Wrapper {
    width: 100%;
    overflow-x: auto; // Enable horizontal scroll
    
    @include respond-to('md') {
      border-radius: $radius-lg;
    }
  }
}
```

**HTML**:
```html
<div class="userListWrapper">
  <div class="userList">
    <DataGrid ... />
  </div>
</div>
```

**Result**: Table scrolls horizontally on mobile while maintaining structure

---

## 🏷️ Status Badges

### Example 11: Color-Coded Order Status
**File**: `_orders.scss`

```scss
.orderStatus {
  display: inline-block;
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-full;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &--pending {
    background-color: lighten($warning-color, 30%);
    color: darken($warning-color, 20%);
  }
  
  &--delivered {
    background-color: lighten($success-color, 40%);
    color: darken($success-color, 10%);
  }
  
  &--canceled {
    background-color: lighten($danger-color, 30%);
    color: darken($danger-color, 10%);
  }
  
  @include respond-to('sm') {
    font-size: 10px;
    padding: 2px $spacing-xs;
  }
}
```

**HTML**:
```html
<span class="orderStatus orderStatus--pending">Pending</span>
<span class="orderStatus orderStatus--delivered">Delivered</span>
```

**Result**: Color-coded badges that scale on mobile

---

## 📋 Form Layouts

### Example 12: Responsive Form
**File**: `_profile.scss`

```scss
.userUpdateForm {
  display: flex;
  justify-content: space-between;
  gap: $spacing-lg;
  margin-top: $spacing-lg;
  
  @include respond-to('lg') {
    flex-direction: column; // Stack on tablets
  }
}

.userUpdateItem {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  
  > label {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $text-secondary;
  }
}

.userUpdateInput {
  border: none;
  border-bottom: 2px solid $primary-color;
  border-radius: $radius-md;
  width: 100%;
  max-width: 350px;
  height: 40px;
  padding: $spacing-sm;
  
  @include respond-to('lg') {
    max-width: 100%; // Full width on tablets
  }
  
  @include respond-to('sm') {
    height: 36px;
    font-size: $font-size-sm;
  }
}
```

**Result**: Side-by-side inputs on desktop, stacked full-width on tablets

---

## 🎨 Advanced Patterns

### Example 13: Combined Grid with Text Truncation
**File**: `_designtool.scss`

```scss
.customOrderdataGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  
  @include respond-to('sm') {
    grid-template-columns: 1fr; // Single column on mobile
    gap: $spacing-sm;
  }
}

.customOrderinfo {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  padding: $spacing-md;
  background-color: $bg-hover;
  border-radius: $radius-md;
  border-left: 3px solid $primary-color;
  
  label {
    font-size: $font-size-xs;
    color: $text-secondary;
    font-weight: $font-weight-medium;
    text-transform: uppercase;
  }
  
  span {
    font-size: $font-size-lg;
    color: $text-primary;
    font-weight: $font-weight-semibold;
    @include text-truncate; // Prevent overflow
    word-break: break-word; // Break long values
  }
}
```

**Result**: 2-column grid becomes 1-column, each cell with truncated content

---

## 🎯 Real Implementation Pattern

### Complete Component Example: Order Card

```scss
// Container
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-xl;
  padding: $spacing-lg;
  
  @include respond-to('md') {
    grid-template-columns: 1fr;
    padding: $spacing-md;
  }
}

// Card
.card {
  width: 100%;
  max-width: 400px;
  background-color: $bg-light;
  border-radius: $radius-xl;
  padding: $spacing-xl;
  padding-top: 80px;
  position: relative;
  @include transition(all);
  
  &:hover {
    transform: translateY(-8px);
  }
  
  @include respond-to('sm') {
    padding: $spacing-md;
    padding-top: 60px;
  }
}

// Image
.image {
  position: absolute;
  width: 150px;
  height: 150px;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: $radius-full;
  object-fit: cover;
  
  @include respond-to('sm') {
    width: 110px;
    height: 110px;
    top: -30px;
  }
}

// Title
.title {
  font-size: $font-size-2xl;
  color: $primary-color;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-lg;
  @include text-truncate;
  
  @include respond-to('sm') {
    font-size: $font-size-lg;
  }
}

// Description
.description {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-lg;
  @include line-clamp(3);
  
  @include respond-to('sm') {
    @include line-clamp(2);
  }
}

// Buttons
.buttons {
  display: flex;
  gap: $spacing-md;
  
  @include respond-to('sm') {
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  button {
    flex: 1;
    
    @include respond-to('sm') {
      width: 100%;
    }
  }
}
```

**HTML**:
```html
<div class="grid">
  <div class="card">
    <img src="/cake.jpg" class="image" alt="Order" />
    <h3 class="title">Chocolate Birthday Cake</h3>
    <p class="description">
      A beautiful chocolate cake with rich frosting and decorations.
      Perfect for celebrations and special occasions.
    </p>
    <div class="buttons">
      <button class="button view">View</button>
      <button class="button edit">Edit</button>
      <button class="button delete">Delete</button>
    </div>
  </div>
</div>
```

**Result**: Fully responsive card with proper text handling at all breakpoints

---

## 🔑 Key Takeaways

1. **Always use responsive mixins** instead of raw media queries
2. **Text truncation requires** `max-width` + `@include text-truncate`
3. **Flex truncation needs** `min-width: 0` on flex children
4. **Images need** `object-fit: cover` for aspect ratio
5. **Mobile buttons** should be full-width with adequate padding
6. **DataGrids** should scroll horizontally on mobile
7. **Grids** should adapt from 3→2→1 columns
8. **Font sizes** should scale down on mobile (but stay readable)

---

## 📚 Further Reading

- Check `_mixins.scss` for all available mixins
- Review `_variables.scss` for spacing/color/breakpoint values
- See `customer-frontend` for additional patterns
- Read `TESTING_GUIDE.md` for verification steps

---

**Pro Tip**: Copy these patterns when creating new components. They've been tested across all breakpoints and devices!
