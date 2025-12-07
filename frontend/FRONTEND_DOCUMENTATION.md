# 🎨 Frontend Documentation - AidMeds

## Tech Stack

- **Framework:** React 19
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Authentication:** JWT (localStorage)

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Medicines.jsx
│   │   ├── Donate.jsx
│   │   ├── Request.jsx
│   │   ├── MyDonations.jsx
│   │   ├── MyRequests.jsx
│   │   ├── Profile.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/        # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── donationService.js
│   │   ├── medicineService.js
│   │   ├── municipioService.js
│   │   └── requestService.js
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── .env.example         # Environment template
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### Development Server

```bash
npm run dev
# Opens at http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output in dist/
```

### Preview Production Build

```bash
npm run preview
```

---

## 🔐 Authentication Flow

### AuthContext

The `AuthContext` manages global authentication state.

**Usage:**
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user.nombre}!</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

**Available Methods:**
- `login(credentials)` - Login user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `updateUser(userData)` - Update user state

**Available State:**
- `user` - Current user object
- `isAuthenticated` - Boolean auth status
- `loading` - Boolean loading state

### Protected Routes

Use `ProtectedRoute` component to protect pages:

```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>

// For admin only
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 🌐 API Services

### Base API Configuration

`src/services/api.js` - Axios instance with JWT interceptor

```javascript
import api from '../services/api';

// All requests automatically include JWT token
const response = await api.get('/medicines');
```

### Auth Service

`src/services/authService.js`

```javascript
import { authService } from '../services/authService';

// Register
const result = await authService.register({
  nombre: 'John',
  apellido: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  telefono: '1234567890',
  direccion: '123 Street',
  id_municipio: 1
});

// Login
const result = await authService.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get profile
const profile = await authService.getProfile();

// Logout
await authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();
```

### Medicine Service

`src/services/medicineService.js`

```javascript
import { medicineService } from '../services/medicineService';

// Get all medicines
const medicines = await medicineService.getAll();

// Search medicines
const results = await medicineService.search('paracetamol');

// Get by ID
const medicine = await medicineService.getById(1);
```

### Donation Service

`src/services/donationService.js`

```javascript
import { donationService } from '../services/donationService';

// Get all donations
const donations = await donationService.getAll();

// Get user's donations
const myDonations = await donationService.getMyDonations();

// Create donation
const formData = new FormData();
formData.append('id_medicamento', 1);
formData.append('cantidad', 50);
formData.append('fecha_caducidad', '2025-12-31');
formData.append('imagen', file);
formData.append('observaciones', 'En buen estado');

const result = await donationService.create(formData);
```

### Request Service

`src/services/requestService.js`

```javascript
import { requestService } from '../services/requestService';

// Get all requests
const requests = await requestService.getAll();

// Get user's requests
const myRequests = await requestService.getMyRequests();

// Create request
const formData = new FormData();
formData.append('id_medicamento', 1);
formData.append('cantidad_solicitada', 10);
formData.append('justificacion', 'Need for treatment');
if (requiresPrescription) {
  formData.append('receta', prescriptionFile);
}

const result = await requestService.create(formData);
```

---

## 📄 Page Components

### Home Page (`pages/Home.jsx`)

Landing page with welcome message and navigation.

### Login Page (`pages/Login.jsx`)

User login form.

**Features:**
- Email and password fields
- Form validation
- Error display
- Redirect after login

### Register Page (`pages/Register.jsx`)

User registration form.

**Features:**
- Full user information form
- Municipality selector
- Password validation
- Automatic login after registration

### Medicines Page (`pages/Medicines.jsx`)

Browse available medicines.

**Features:**
- Medicine list with search
- Filter by type (con/sin receta)
- Availability status

### Donate Page (`pages/Donate.jsx`)

Create medicine donations.

**Features:**
- Medicine selector
- Quantity input
- Expiration date picker
- Image upload
- Form validation

### Request Page (`pages/Request.jsx`)

Request medicines.

**Features:**
- Medicine selector
- Quantity input
- Justification textarea
- Prescription upload (if required)
- Form validation

### My Donations (`pages/MyDonations.jsx`)

View user's donations.

**Features:**
- Donation history
- Status badges (pendiente, aprobada, rechazada)
- Donation details
- Error handling with retry

### My Requests (`pages/MyRequests.jsx`)

View user's requests.

**Features:**
- Request history
- Status badges
- Request details
- Error handling with retry

### Profile Page (`pages/Profile.jsx`)

User profile management.

**Features:**
- Edit profile information
- Change password
- Municipality selector
- Form validation

### Admin Dashboard (`pages/AdminDashboard.jsx`)

Admin management panel.

**Features:**
- Pending donations review
- Pending requests review
- Approve/reject actions
- Statistics overview

---

## 🎨 Component Examples

### Creating a New Page

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MyNewPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      // Load your data
      const response = await someService.getData();
      setData(response.data);
    } catch (error) {
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow">
        <p className="text-red-600">{error}</p>
        <button onClick={loadData} className="mt-4 btn-primary">
          Retry
        </button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My New Page</h1>
        {/* Your content */}
      </div>
    </div>
  );
};

export default MyNewPage;
```

### Adding a New Route

In `App.jsx`:

```javascript
import MyNewPage from './pages/MyNewPage';
import ProtectedRoute from './components/ProtectedRoute';

// Inside Routes component
<Route 
  path="/my-new-page" 
  element={
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  } 
/>
```

---

## 🎨 Tailwind CSS Classes

### Common Button Styles

```jsx
{/* Primary button */}
<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
  Primary Action
</button>

{/* Secondary button */}
<button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
  Secondary Action
</button>

{/* Danger button */}
<button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
  Delete
</button>
```

### Form Inputs

```jsx
<input 
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter text"
/>
```

### Status Badges

```jsx
{/* Success */}
<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
  Aprobada
</span>

{/* Warning */}
<span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
  Pendiente
</span>

{/* Error */}
<span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
  Rechazada
</span>
```

---

## 🐛 Debugging

### Check Token

Open browser console:
```javascript
// Check if token exists
localStorage.getItem('token')

// Decode JWT (paste token at jwt.io)
// Or in console:
JSON.parse(atob(localStorage.getItem('token').split('.')[1]))

// Clear token
localStorage.removeItem('token')
```

### Network Requests

1. Open DevTools → Network tab
2. Filter by "XHR" or "Fetch"
3. Check request headers for `Authorization: Bearer...`
4. Check response for errors

### Common Issues

**401 Unauthorized:**
- Token missing or expired
- Clear localStorage and login again

**CORS Errors:**
- Check backend is running
- Verify VITE_API_URL in .env

**Component Not Updating:**
- Check useEffect dependencies
- Verify state updates are immutable

---

## 🔧 Environment Variables

### Available Variables

- `VITE_API_URL` - Backend API URL

### Usage in Code

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
console.log('API URL:', apiUrl);
```

---

## 📦 Building for Production

### Build

```bash
npm run build
```

### Environment Variables for Production

Create `.env.production`:
```env
VITE_API_URL=https://your-api.com/api
```

### Deploy

Upload `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting

---

## 🧪 Testing

### Test Authentication Flow

1. Go to `/register`
2. Fill form and submit
3. Check localStorage has token
4. Should redirect to home
5. Navbar should show username

### Test Protected Routes

1. Logout
2. Try accessing `/profile`
3. Should redirect to `/login`
4. Login
5. Try accessing `/profile` again
6. Should work

---

## 📝 Best Practices

1. **Always use AuthContext** for auth state
2. **Always wrap protected pages** with ProtectedRoute
3. **Handle errors gracefully** with try/catch
4. **Show loading states** during async operations
5. **Display user-friendly error messages**
6. **Keep components focused** (single responsibility)
7. **Use services** for API calls, not direct axios
8. **Validate forms** before submitting

---

## 🚀 Next Steps

1. Add unit tests (Vitest)
2. Add E2E tests (Playwright/Cypress)
3. Implement pagination
4. Add infinite scroll
5. Implement real-time updates
6. Add notifications system
7. Improve accessibility (ARIA labels)
8. Add dark mode

---

**Last Updated:** December 7, 2024  
**Frontend Version:** 1.0.0
