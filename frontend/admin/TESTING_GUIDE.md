# 🧪 Responsive Testing Guide

## Quick Testing Checklist for Admin Frontend

---

## 🖥️ Desktop Testing (1920px)

### Dashboard
- [ ] Featured cards show 3 columns
- [ ] Widget usernames display without truncation
- [ ] Charts render full width
- [ ] All text readable

### Products
- [ ] Product grid shows 2-3 items per row
- [ ] Images maintain aspect ratio
- [ ] Titles show 2 lines before truncation
- [ ] Prices display completely

### Customers
- [ ] Table shows all columns
- [ ] Names display with reasonable length
- [ ] Action buttons visible and clickable

### Orders
- [ ] Card grid shows 3 columns
- [ ] Order images circular and centered
- [ ] Descriptions show 3 lines
- [ ] All buttons in row layout

---

## 💻 Laptop Testing (1366px)

### All Pages
- [ ] Grids adapt to 2 columns where applicable
- [ ] Sidebar remains visible
- [ ] Text truncates at appropriate lengths
- [ ] No horizontal scrollbars (except DataGrids)

---

## 📱 Tablet Testing (768px-991px)

### Dashboard
- [ ] Featured cards stack 2 columns
- [ ] Widgets show scroll indicator
- [ ] Font sizes reduced but readable

### Products
- [ ] Single column product list
- [ ] Images scale down proportionally
- [ ] Cards maintain padding

### Customers & Staff
- [ ] DataGrid scrolls horizontally
- [ ] Names truncate at ~150px
- [ ] Action icons remain visible

### Orders
- [ ] Cards stack single column
- [ ] Images scale to 130px
- [ ] Buttons remain in row (if space)

---

## 📱 Mobile Testing (375px-767px)

### Global
- [ ] Sidebar hidden/hamburger menu visible
- [ ] All content single column
- [ ] Touch targets minimum 44px
- [ ] No text overflow issues

### Dashboard
- [ ] Featured cards stack vertically
- [ ] Usernames truncate at 100px
- [ ] Chart height reduced

### Products
- [ ] One product per row
- [ ] Images scale to card width
- [ ] Titles use line-clamp(2)
- [ ] Button full width

### Customers & Staff
- [ ] Tables scroll horizontally smoothly
- [ ] Row heights appropriate for touch
- [ ] Edit/delete buttons usable

### Orders
- [ ] Cards stack with proper spacing
- [ ] Order images 110px
- [ ] Descriptions show 2 lines
- [ ] Buttons stack vertically full width

### Feedbacks
- [ ] Review cards single column
- [ ] Star ratings visible
- [ ] Review text shows 3 lines
- [ ] Avatar 80px

### Profile
- [ ] Form sections stack vertically
- [ ] Input fields full width
- [ ] Avatar centers above info
- [ ] Update button full width

### Design Tool
- [ ] Custom order cards single column
- [ ] Images scale to 140px
- [ ] Info grid single column
- [ ] Buttons stack vertically

---

## 🔍 Text Truncation Checks

### Test These Specific Scenarios:

#### Long Usernames
```
Username: "verylongusernamethatshouldbetru..."
Expected: Truncates with ellipsis
```

#### Long Product Titles
```
Title: "Delicious Chocolate Cake with Extra..."
Expected: Shows 2 lines maximum with ellipsis
```

#### Long Descriptions
```
Description: Multiple paragraphs of text...
Expected: Shows 2-3 lines with ellipsis based on screen size
```

#### Long Email Addresses
```
Email: "verylongemailaddress@example..."
Expected: Truncates appropriately in table cells
```

#### Long Order Numbers/IDs
```
Order ID: "ORD-2024-12-31-ABCD-123456789"
Expected: Breaks or wraps without breaking layout
```

---

## 🎯 Browser Testing

### Chrome/Edge
- [ ] All pages render correctly
- [ ] SASS compiles without errors
- [ ] Text truncation works
- [ ] Responsive breakpoints trigger

### Firefox
- [ ] line-clamp works (vendor prefix)
- [ ] Grid layouts consistent
- [ ] Text rendering correct

### Safari (iOS)
- [ ] Webkit prefixes working
- [ ] Touch interactions smooth
- [ ] Scrolling performance good

---

## 🐛 Common Issues to Check

### Layout Issues
- [ ] No horizontal scrollbars (unless intended)
- [ ] No overlapping elements
- [ ] Proper spacing between items
- [ ] Cards don't stretch abnormally

### Text Issues
- [ ] No text overflow beyond containers
- [ ] Ellipsis appears where expected
- [ ] Font sizes readable on mobile
- [ ] Line heights appropriate

### Image Issues
- [ ] No stretched or distorted images
- [ ] Proper aspect ratios maintained
- [ ] Avatars remain circular
- [ ] Product images scale correctly

### Interactive Elements
- [ ] Buttons have adequate touch targets
- [ ] Hover states work on desktop
- [ ] Click/tap areas not too small
- [ ] Dropdown menus positioned correctly

---

## 🛠️ DevTools Testing Commands

### Open Responsive Mode
- **Chrome**: `Ctrl/Cmd + Shift + M`
- **Firefox**: `Ctrl/Cmd + Shift + M`

### Test Specific Devices
```
iPhone SE:    375x667
iPhone 12:    390x844
iPad:         768x1024
iPad Pro:     1024x1366
Desktop:      1920x1080
```

### Console Commands to Test
```javascript
// Check current breakpoint
console.log(window.innerWidth);

// Force reflow to test truncation
document.querySelectorAll('[class*="truncate"]').forEach(el => {
  console.log(el.scrollWidth, el.clientWidth);
});
```

---

## ✅ Sign-Off Checklist

### Before Deployment
- [ ] All pages tested on 5 screen sizes
- [ ] Text truncation verified on all pages
- [ ] No console errors
- [ ] SASS compiles successfully
- [ ] Images load correctly
- [ ] Forms work on mobile
- [ ] Tables scroll on mobile
- [ ] Buttons accessible on touch devices
- [ ] Color contrast acceptable
- [ ] Loading states functional

### Performance
- [ ] No layout shifts on load
- [ ] Images optimized/lazy loaded
- [ ] CSS bundle size reasonable
- [ ] First contentful paint < 2s
- [ ] Interactive elements respond quickly

---

## 📸 Screenshot Checklist

Take screenshots of:
1. Dashboard - Desktop, Tablet, Mobile
2. Products - Desktop, Mobile
3. Customers - Desktop, Mobile (showing horizontal scroll)
4. Orders - Desktop, Mobile (cards stacked)
5. Profile - Desktop, Mobile (sections stacked)

Save in: `/docs/screenshots/responsive/`

---

## 🚨 Critical Issues (STOP SHIP)

- [ ] Text overflows container boundaries
- [ ] Layout breaks on any common device size
- [ ] Forms unusable on mobile
- [ ] Critical actions unreachable on touch devices
- [ ] Sidebar permanently blocks content on mobile
- [ ] Images don't load
- [ ] Console shows errors

## ⚠️ Non-Critical Issues (Nice to Fix)

- [ ] Minor alignment issues
- [ ] Font sizes could be optimized
- [ ] Animation timing could improve
- [ ] Color contrast borderline
- [ ] Loading states could be smoother

---

## 📊 Testing Matrix

| Page | Desktop | Laptop | Tablet | Mobile | Text Truncation |
|------|---------|--------|--------|--------|----------------|
| Dashboard | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Products | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Customers | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Orders | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Staff | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Feedbacks | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Profile | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Design Tool | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## 🎓 Quick Fix Reference

### Text Overflowing?
```scss
@include text-truncate; // Single line
@include line-clamp(2); // Multiple lines
```

### Grid Not Responsive?
```scss
@include respond-to('md') {
  grid-template-columns: 1fr;
}
```

### Button Too Small on Mobile?
```scss
@include respond-to('sm') {
  width: 100%;
  padding: $spacing-sm $spacing-md;
}
```

### Image Distorted?
```scss
img {
  object-fit: cover;
  width: 100%;
  height: auto;
}
```

---

**Remember**: Test with real content, not just lorem ipsum. Long usernames, product titles, and descriptions will expose truncation issues!

**Pro Tip**: Use Chrome DevTools Network throttling to test on slower connections - responsive isn't just about size!
