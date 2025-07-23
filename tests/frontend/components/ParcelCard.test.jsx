import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ParcelCard from '../../../src/components/ParcelCard';

const mockParcel = {
  id: 1,
  trackingNumber: 'DEL123456',
  senderName: 'John Doe',
  receiverName: 'Jane Smith',
  pickupAddress: '123 Main St, New York, NY',
  destinationAddress: '456 Oak Ave, Brooklyn, NY',
  weight: 2.5,
  price: 15.99,
  status: 'in_transit',
  createdAt: '2025-01-27T10:00:00Z',
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ParcelCard Component', () => {
  test('renders parcel information correctly', () => {
    renderWithRouter(<ParcelCard parcel={mockParcel} />);
    
    expect(screen.getByText('DEL123456')).toBeInTheDocument();
    expect(screen.getByText('John Doe → Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('2.5 kg')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
  });

  test('renders status badge', () => {
    renderWithRouter(<ParcelCard parcel={mockParcel} />);
    expect(screen.getByText('In Transit')).toBeInTheDocument();
  });

  test('renders view details link', () => {
    renderWithRouter(<ParcelCard parcel={mockParcel} />);
    const viewDetailsLink = screen.getByText('View Details');
    expect(viewDetailsLink).toBeInTheDocument();
    expect(viewDetailsLink.closest('a')).toHaveAttribute('href', '/parcel/1');
  });

  test('renders addresses correctly', () => {
    renderWithRouter(<ParcelCard parcel={mockParcel} />);
    expect(screen.getByText(/123 Main St, New York, NY → 456 Oak Ave, Brooklyn, NY/)).toBeInTheDocument();
  });

  test('renders formatted date', () => {
    renderWithRouter(<ParcelCard parcel={mockParcel} />);
    expect(screen.getByText('Jan 27, 2025')).toBeInTheDocument();
  });
});