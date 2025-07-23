import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from '../../src/App';
import userSlice from '../../src/redux/userSlice';
import parcelsSlice from '../../src/redux/parcelsSlice';
import notificationSlice from '../../src/redux/notificationSlice';

// Mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice,
      parcels: parcelsSlice,
      notifications: notificationSlice,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (component, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  test('renders home page for unauthenticated user', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/Fast & Reliable/i)).toBeInTheDocument();
    expect(screen.getByText(/Parcel Delivery/i)).toBeInTheDocument();
  });

  test('renders navbar with login/register links for unauthenticated user', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('renders dashboard for authenticated user', () => {
    const initialState = {
      user: {
        isAuthenticated: true,
        user: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        loading: false,
        error: null,
      },
      parcels: {
        parcels: [],
        loading: false,
        error: null,
      },
      notifications: {
        notifications: [],
      },
    };

    renderWithProviders(<App />, initialState);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renders admin panel link for admin user', () => {
    const initialState = {
      user: {
        isAuthenticated: true,
        user: { id: 1, name: 'Admin User', email: 'admin@deliveroo.com', role: 'admin' },
        loading: false,
        error: null,
      },
      parcels: {
        parcels: [],
        loading: false,
        error: null,
      },
      notifications: {
        notifications: [],
      },
    };

    renderWithProviders(<App />, initialState);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});