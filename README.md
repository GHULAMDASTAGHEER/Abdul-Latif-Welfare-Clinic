# Abdul Latif Welfare Clinic - Hospital Management System

A comprehensive hospital management system built with React, Redux, and modern web technologies.

## Features

### 1. Authentication & User Management
- Secure login system
- Role-based access control (Admin, Doctor, Staff)
- Admin can manage users (add, edit, delete)

### 2. Patient Management
- Patient registration with token system
- Patient list with search and filters
- Date-based patient records
- Auto-generated serial numbers and tokens

### 3. Point of Sale (POS)
- Medicine sales interface
- Real-time inventory tracking
- Customer management
- Invoice generation

### 4. Inventory Management
- CRUD operations for medicines and lab tests
- Stock management
- Brand management
- Low stock alerts
- Price management (purchase and sale)

### 5. Prescription Management
- Digital prescription creation
- Medicine schedule (Morning, Afternoon, Evening, Night)
- Before/After meal instructions
- Duration tracking
- Printable prescription preview
- Patient information management

### 6. Sales Reports
- Sales invoices listing
- Sales summary with analytics
- Item-wise sales history
- Date-based filtering

### 7. Purchase Management
- Purchase invoice creation
- Supplier management
- Purchase history
- Item-wise purchase tracking

### 8. Returns Management
- Sale returns processing
- Purchase returns processing
- Return history tracking
- Automatic stock adjustment

### 9. Cash History
- All transactions in one place
- Income and expense tracking
- Net balance calculation
- Filter by date and transaction type

### 10. Maintenance Module
- Medicine brands management
- Lab test brands management
- Category management

### 11. Printer Setup
- Configurable print settings
- Paper size options
- Custom clinic information
- Print preview
- Multiple layout options

## Default Login Credentials

- **Username:** admin
- **Password:** admin123
- **Role:** Admin

## Tech Stack

- React 19
- Redux Toolkit for state management
- React Router for navigation
- LocalStorage for data persistence
- LocalForage for large data storage
- Modern CSS with gradients and animations

## Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build
```

## Network Setup (LAN)

The system is designed to work over LAN cable connections throughout the hospital:

1. Deploy the build on a central server
2. Access via IP address from any connected device
3. All data is stored locally on the server
4. Multiple users can access simultaneously

## Features Overview

### Patient Registration
- Quick token generation
- Multiple doctor slots (Morning/Evening)
- Fee management with free patient option
- Auto-incrementing serial numbers
- Instant receipt printing

### POS System
- Fast item search
- Cart management
- Customer details capture
- Real-time stock updates
- Invoice generation

### Prescription System
- Complete patient information
- Multiple medicines per prescription
- Detailed dosage instructions
- Full-page preview for patients
- Clear medicine usage instructions

### Reports & Analytics
- Comprehensive sales reports
- Purchase tracking
- Item-wise analysis
- Date range filtering
- Financial summaries

### User Management (Admin Only)
- Add new users
- Assign roles
- Edit user information
- Delete users
- Secure password management

## Best Practices

1. Regular data backups
2. Secure user credentials
3. Regular stock audits
4. Print settings configuration
5. Staff training on system usage

## Support

For technical support or feature requests, contact the development team.

---

Built with ❤️ for Abdul Latif Welfare Clinic
