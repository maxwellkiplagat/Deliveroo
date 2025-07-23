# 🚀 Deliveroo - Parcel Delivery Platform

A comprehensive web-based courier service application that enables users to create, manage, and track parcel deliveries with real-time tracking, status updates, and pricing based on parcel weight.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 👤 User Features
- **Authentication**: Secure sign up and login system
- **Parcel Management**: Create, view, edit, and cancel delivery orders
- **Real-time Tracking**: Track parcel status and location updates
- **Interactive Maps**: Google Maps integration with pickup/destination markers and routes
- **Address Autocomplete**: Smart address suggestions and saved addresses
- **Pricing Calculator**: Dynamic pricing based on weight and distance
- **Order History**: View and search through past deliveries
- **Email Notifications**: Automatic updates on status changes

### 🛠️ Admin Features
- **Dashboard Analytics**: Comprehensive overview with statistics
- **Parcel Management**: Update status and location of all deliveries
- **User Management**: View and manage user accounts
- **Search & Filters**: Advanced filtering and search capabilities
- **Real-time Updates**: Live tracking of all active deliveries

### 🔐 Security Features
- **Role-Based Access Control**: User, Admin, and Courier roles
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive data validation
- **Password Hashing**: Secure password storage

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Date-fns** - Date manipulation

### Backend
- **Python Flask** - Web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Flask-JWT-Extended** - JWT authentication
- **Flask-Mail** - Email notifications
- **Marshmallow** - Data validation
- **Flask-CORS** - Cross-origin requests

### Testing
- **Jest** - Frontend testing
- **React Testing Library** - Component testing
- **Pytest** - Backend testing

### Tools & Services
- **Google Maps API** - Maps and geocoding
- **Vite** - Build tool
- **ESLint** - Code linting

## 📁 Project Structure

```
deliveroo/
├── README.md
├── package.json                 # React frontend config
├── requirements.txt            # Flask backend dependencies
├── .gitignore
├── .env                        # Environment variables
│
├── src/                        # React Frontend
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Main app component
│   ├── components/             # UI components
│   │   ├── Navbar.jsx
│   │   ├── ParcelCard.jsx
│   │   ├── MapView.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── Timeline.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── SearchFilter.jsx
│   │   ├── StatsCard.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── PricingCalculator.jsx
│   │   ├── AddressAutocomplete.jsx
│   │   └── ToastNotification.jsx
│   ├── pages/                  # Page views
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ParcelDetails.jsx
│   │   └── AdminPanel.jsx
│   ├── redux/                  # Redux Toolkit store
│   │   ├── store.js
│   │   ├── userSlice.js
│   │   ├── parcelsSlice.js
│   │   └── notificationSlice.js
│   ├── services/               # API clients
│   │   └── api.js
│   ├── utils/                  # Utility functions
│   │   ├── auth.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── hooks/                  # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   └── useDebounce.js
│   └── styles/                 # Styles
│       └── index.css
│
├── server/                     # Flask Backend
│   ├── app.py                  # Flask entry point
│   ├── config.py               # App configuration
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── parcel.py
│   │   └── location.py
│   ├── routes/                 # API endpoints
│   │   ├── auth_routes.py
│   │   ├── parcel_routes.py
│   │   └── admin_routes.py
│   ├── controllers/            # Business logic
│   │   ├── auth_controller.py
│   │   ├── parcel_controller.py
│   │   └── email_controller.py
│   ├── schemas/                # Data validation
│   │   ├── user_schema.py
│   │   └── parcel_schema.py
│   └── utils/                  # Helper modules
│       ├── email.py
│       ├── jwt.py
│       └── decorators.py
│
├── database/                   # Database setup
│   ├── schema.sql
│   └── seed.py
│
└── tests/                      # Test suites
    ├── frontend/               # React tests
    │   ├── setupTests.js
    │   ├── App.test.jsx
    │   └── components/
    └── backend/                # Flask tests
        ├── test_auth.py
        └── test_parcels.py
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL (v12 or higher) or Supabase account
- Google Maps API key

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

### Backend Setup

#### Option 1: Using Supabase (Recommended)

1. **Create a Supabase project**:
   - Go to [Supabase](https://supabase.com) and create a new project
   - Get your project URL and anon key from the project settings

2. **Set up the database**:
   - In your Supabase dashboard, go to the SQL Editor
   - Copy and paste the contents of `supabase/migrations/create_deliveroo_schema.sql`
   - Run the SQL to create all tables and policies

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Update the Supabase URL and keys in .env
   ```

#### Option 2: Using Local PostgreSQL

1. **Create virtual environment**:
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate
   export PYTHONPATH=$PYTHONPATH:$(pwd)/server
   export FLASK_APP=server.app:create_app # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up database**:
   ```bash
   # Create PostgreSQL database
   createdb deliveroo
   
   # Run schema (convert Supabase migration to PostgreSQL)
   psql -d deliveroo -f ../supabase/migrations/create_deliveroo_schema.sql
   
   # Seed database (optional)
   python ../database/seed.py
   ```

4. **Start Flask server**:
   ```bash
   python app.py
   ```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and update the values:

```env
# Supabase Configuration (if using Supabase)
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Database (if using local PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/deliveroo

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Email Configuration (for backend)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# JWT Configuration (for backend)
JWT_SECRET_KEY=your-jwt-secret-key-here
SECRET_KEY=your-flask-secret-key-here
```

### Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

## 📖 Usage

### Database Setup

The application now supports both Supabase (cloud) and local PostgreSQL:

**Supabase (Recommended for production):**
- Automatic backups and scaling
- Built-in authentication and real-time features
- Easy deployment and management

**Local PostgreSQL (Good for development):**
- Full control over database
- No external dependencies
- Better for offline development

### Demo Credentials

**User Account:**
- Email: `john@example.com`
- Password: `password`

**Admin Account:**
- Email: `admin@deliveroo.com`
- Password: `admin`

### Key Features Usage

#### Time-Limited Parcel Updates
- Parcels can only be edited within 24 hours of creation
- Delivered and cancelled parcels cannot be modified
- Admin users can override these restrictions

#### Saved Addresses Management
- Users can save frequently used addresses
- Addresses are categorized (Home, Work, Favorite)
- Quick selection during parcel creation

#### Email Notifications
- Automatic emails for status changes
- Location update notifications
- Delivery confirmation emails
- Configurable notification preferences

#### Courier Management
- Admin can add and manage couriers
- Manual courier assignment to parcels
- Real-time courier status tracking
- Vehicle type and license management

1. **Creating a Parcel**:
   - Login to your account
   - Go to Dashboard
   - Click "New Parcel"
   - Fill in sender/receiver details
   - Enter pickup and destination addresses
   - Set weight and view calculated price
   - Submit the order

2. **Tracking a Parcel**:
   - View parcel cards on dashboard
   - Click "View Details" for full tracking
   - See real-time location on map
   - View timeline of status updates

3. **Admin Management**:
   - Login with admin credentials
   - Access Admin Panel
   - Update parcel status and location
   - View analytics and statistics
   - Manage all user parcels

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Parcel Endpoints

```
GET    /api/parcels           # Get user parcels
POST   /api/parcels           # Create parcel
GET    /api/parcels/:id       # Get parcel details
PUT    /api/parcels/:id       # Update parcel
DELETE /api/parcels/:id       # Cancel parcel
```

### Admin Endpoints

```
GET /api/admin/parcels              # Get all parcels
PUT /api/admin/parcels/:id/status   # Update status
PUT /api/admin/parcels/:id/location # Update location
GET /api/admin/analytics            # Get analytics
```

### Request/Response Examples

**Create Parcel:**
```json
POST /api/parcels
{
  "senderName": "John Doe",
  "receiverName": "Jane Smith",
  "pickupAddress": "123 Main St, New York, NY",
  "destinationAddress": "456 Oak Ave, Brooklyn, NY",
  "pickupCoords": {"lat": 40.7128, "lng": -74.0060},
  "destinationCoords": {"lat": 40.6782, "lng": -73.9442},
  "weight": 2.5,
  "price": 15.99
}
```

## 🧪 Testing

### Database Testing

The application includes comprehensive database testing:

```bash
# Test database connection
python server/test_db_connection.py

# Run database migrations
python server/migrate.py

# Seed test data
python database/seed.py
```

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Backend Tests

```bash
# Install test dependencies
pip install pytest pytest-flask

# Run all tests
pytest

# Run with coverage
pytest --cov=server

# Run specific test file
pytest tests/backend/test_parcels.py
```

### Test Structure

- **Unit Tests**: Individual component/function testing
- **Integration Tests**: API endpoint testing
- **Component Tests**: React component testing
- **E2E Tests**: Full user flow testing (future)

## 🚀 Deployment

### Database Deployment

**Using Supabase (Recommended):**
1. Create a production Supabase project
2. Run the migration SQL in the Supabase SQL Editor
3. Update environment variables with production URLs
4. Enable Row Level Security policies

**Using Managed PostgreSQL:**
1. Set up a managed PostgreSQL instance (AWS RDS, Google Cloud SQL, etc.)
2. Run the migration SQL on the production database
3. Update DATABASE_URL with production connection string
4. Ensure proper security groups and firewall rules

### Frontend Deployment (Netlify/Vercel)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Backend Deployment (Heroku/Railway)

1. **Prepare for deployment**:
   ```bash
   # Create Procfile
   echo "web: python server/app.py" > Procfile
   
   # Update requirements.txt
   pip freeze > requirements.txt
   ```

2. **Deploy to Heroku**:
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   heroku config:set FLASK_ENV=production
   git push heroku main
   ```

### Environment Variables for Production

```env
# Production Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Production API
VITE_API_BASE_URL=https://your-api-domain.com/api

# Production Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-production-maps-key

# Backend Production Variables
DATABASE_URL=your-production-database-url
JWT_SECRET_KEY=your-production-jwt-secret
SECRET_KEY=your-production-flask-secret
SMTP_HOST=your-production-smtp-host
SMTP_USER=your-production-email
SMTP_PASSWORD=your-production-email-password
```

## 🤝 Contributing

### Database Contributions

When contributing database changes:

1. **Create new migration files** in `supabase/migrations/`
2. **Test migrations** on both Supabase and local PostgreSQL
3. **Update seed data** if necessary
4. **Document schema changes** in the migration file comments
5. **Test RLS policies** to ensure proper security

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code Style

- **Frontend**: ESLint configuration with React best practices
- **Backend**: PEP 8 Python style guide
- **Commits**: Conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Database Issues

**Supabase Connection Issues:**
- Verify your project URL and anon key
- Check if RLS policies are properly configured
- Ensure your IP is not blocked by Supabase

**Local PostgreSQL Issues:**
- Verify PostgreSQL is running: `pg_ctl status`
- Check database exists: `psql -l`
- Verify connection string format
- Ensure user has proper permissions

**Migration Issues:**
- Check for syntax errors in SQL files
- Verify all foreign key references exist
- Ensure proper data types for your PostgreSQL version

### Performance Optimization

**Database Performance:**
- Indexes are automatically created for foreign keys
- Consider adding indexes for frequently queried columns
- Use EXPLAIN ANALYZE to identify slow queries
- Monitor connection pool usage

**Frontend Performance:**
- Enable React.StrictMode for development
- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size with code splitting

## 🙏 Acknowledgments

- Google Maps API for mapping services
- Tailwind CSS for styling framework
- Lucide React for beautiful icons
- Flask community for excellent documentation
- React community for comprehensive ecosystem

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@deliveroo.com
- Documentation: [Wiki](https://github.com/your-repo/deliveroo/wiki)

---

**Built with ❤️ by the Deliveroo Team**