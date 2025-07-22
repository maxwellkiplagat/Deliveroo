import { render, screen } from '@testing-library/react';
import StatusBadge from '../../../src/components/StatusBadge';

describe('StatusBadge Component', () => {
  test('renders pending status correctly', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Pending').closest('span')).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  test('renders in_transit status correctly', () => {
    render(<StatusBadge status="in_transit" />);
    expect(screen.getByText('In Transit')).toBeInTheDocument();
    expect(screen.getByText('In Transit').closest('span')).toHaveClass('bg-indigo-100', 'text-indigo-800');
  });

  test('renders delivered status correctly', () => {
    render(<StatusBadge status="delivered" />);
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Delivered').closest('span')).toHaveClass('bg-green-100', 'text-green-800');
  });

  test('renders cancelled status correctly', () => {
    render(<StatusBadge status="cancelled" />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Cancelled').closest('span')).toHaveClass('bg-red-100', 'text-red-800');
  });

  test('renders picked_up status correctly', () => {
    render(<StatusBadge status="picked_up" />);
    expect(screen.getByText('Picked Up')).toBeInTheDocument();
    expect(screen.getByText('Picked Up').closest('span')).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  test('falls back to pending for unknown status', () => {
    render(<StatusBadge status="unknown" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});