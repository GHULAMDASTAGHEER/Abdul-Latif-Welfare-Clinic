# Setup Guide - Abdul Latif Welfare Clinic HMS

## Quick Start

### 1. Installation
```bash
cd Abdul-Latif-Welfare-Clinic
npm install
```

### 2. Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### 3. Production Build
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Role: Administrator (Full Access)

## System Features

### 1. Authentication & Authorization
- Secure login system
- Role-based access control
- Admin, Doctor, and Staff roles
- Protected routes

### 2. Patient Management
- Patient registration with auto-generated tokens
- Serial number tracking
- Multiple doctor slots (Morning/Evening)
- Fee management with free patient option
- Patient history and records
- Date-based filtering
- Search functionality

### 3. Point of Sale (POS)
- Real-time medicine sales
- Cart management
- Customer information capture
- Invoice generation
- Automatic stock updates
- Sales history

### 4. Inventory Management
- Add, edit, delete items
- Medicine and lab test tracking
- Stock level monitoring
- Low stock alerts
- Purchase and sale price management
- Brand management
- Item categorization

### 5. Prescription System
- Digital prescription creation
- Multiple medicines per prescription
- Medicine schedule (Morning, Afternoon, Evening, Night)
- Before/After meal instructions
- Duration tracking
- Full-page preview
- Printable prescriptions
- Patient information management

### 6. Sales Reports
- Sales invoice listing
- Sales summary and analytics
- Item-wise sales history
- Date-based filtering
- Revenue tracking
- Average sale calculations

### 7. Purchase Management
- Purchase invoice creation
- Supplier management
- Purchase history
- Item-wise purchase tracking
- Automatic stock updates
- Cost analysis

### 8. Returns Management
- Sale returns processing
- Purchase returns processing
- Return history
- Automatic stock adjustments
- Refund tracking
- Reason documentation

### 9. Cash History
- All transactions in one view
- Income and expense tracking
- Net balance calculation
- Filter by date and type
- Transaction categorization
- Financial overview

### 10. Maintenance Module
- Medicine brand management
- Lab test brand management
- Category management
- Brand descriptions

### 11. Printer Setup
- Configurable print settings
- Paper size options (A4, Letter, Thermal)
- Orientation settings
- Margin adjustments
- Font size options
- Custom clinic information
- Print preview
- Header/Footer options

### 12. User Management (Admin Only)
- Add new users
- Edit user details
- Delete users
- Role assignment
- Password management
- User list view

## Network Setup for Hospital LAN

### Option 1: Local Network (Recommended for Hospital)

1. **Build the Application:**
   ```bash
   npm run build
   ```

2. **Deploy on a Server:**
   - Copy the `dist` folder to your server
   - Use a web server like Nginx or Apache
   - Configure the server to serve the static files

3. **Access from Multiple Computers:**
   - Find your server's IP address: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Access from any computer on the network: `http://SERVER_IP`

### Option 2: Development Server (Testing Only)

1. **Allow Network Access:**
   Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     server: {
       host: '0.0.0.0',
       port: 5173
     }
   })
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Access from Network:**
   - Find your IP: `ipconfig` or `ifconfig`
   - Access: `http://YOUR_IP:5173`

### Option 3: Production with Node Server

1. **Install serve:**
   ```bash
   npm install -g serve
   ```

2. **Build and Serve:**
   ```bash
   npm run build
   serve -s dist -l 3000
   ```

3. **Access:** `http://SERVER_IP:3000`

## Data Storage

### LocalStorage
- User accounts
- Settings and preferences
- Printer configurations
- Doctor slots

### IndexedDB (via LocalForage)
- Patient records (large datasets)
- Persistent storage
- Offline capability

### Redux Store
- Application state
- Real-time data
- Inventory
- Sales/Purchase records
- Prescriptions

## User Workflow

### For Reception/Staff:
1. Login with staff credentials
2. Register patients
3. Generate tokens
4. Manage patient records
5. Process sales (POS)
6. View reports

### For Doctors:
1. Login with doctor credentials
2. View patient list
3. Create prescriptions
4. Access patient history

### For Admin:
1. Full system access
2. User management
3. Inventory management
4. Financial reports
5. System configuration
6. Printer setup

## Best Practices

### Daily Operations:
- Start with patient registration
- Use POS for medicine sales
- Create prescriptions for patients
- Review cash history at end of day

### Weekly Tasks:
- Check inventory levels
- Review low stock items
- Update purchase records
- Generate sales reports

### Monthly Tasks:
- Full inventory audit
- Financial reconciliation
- User access review
- System backup

## Troubleshooting

### Login Issues:
- Verify username and password
- Check if caps lock is on
- Contact admin for password reset

### Data Not Saving:
- Check browser local storage
- Clear browser cache if needed
- Ensure sufficient storage space

### Print Issues:
- Configure printer setup in settings
- Check browser print settings
- Verify printer connection

### Network Access Issues:
- Verify network connection
- Check firewall settings
- Confirm server IP address
- Test with ping command

## Data Backup

### Manual Backup:
1. Go to Patient List
2. Click "View Data"
3. Click "Copy JSON"
4. Save to external storage

### Browser Data:
- Located in browser's IndexedDB
- Can be exported via browser developer tools
- Consider regular backups

## Security Notes

1. **Change Default Password:**
   - Immediately change admin password
   - Use strong passwords

2. **User Access:**
   - Create separate accounts for staff
   - Assign appropriate roles
   - Remove inactive users

3. **Network Security:**
   - Use secure WiFi/LAN
   - Consider VPN for remote access
   - Regular security audits

4. **Data Protection:**
   - Regular backups
   - Secure storage location
   - Access control

## Support & Updates

For technical support:
1. Check this guide
2. Review README.md
3. Contact system administrator

System developed for Abdul Latif Welfare Clinic
Version 1.0.0

