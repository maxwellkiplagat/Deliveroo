import pytest
import json
from server.app import create_app
from server.models import db, User, Parcel, Location
from server.config import Config

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_SECRET_KEY = 'test-secret-key'

@pytest.fixture
def app():
    app = create_app()
    app.config.from_object(TestConfig)
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    # Create test user
    user = User(name='Test User', email='test@example.com', phone='+1234567890')
    user.set_password('password')
    db.session.add(user)
    db.session.commit()
    
    # Login to get token
    response = client.post('/api/auth/login', 
                          json={'email': 'test@example.com', 'password': 'password'})
    token = json.loads(response.data)['token']
    
    return {'Authorization': f'Bearer {token}'}

@pytest.fixture
def admin_headers(client):
    # Create admin user
    admin = User(name='Admin User', email='admin@example.com', phone='+1234567890', role='admin')
    admin.set_password('admin')
    db.session.add(admin)
    db.session.commit()
    
    # Login to get token
    response = client.post('/api/auth/login', 
                          json={'email': 'admin@example.com', 'password': 'admin'})
    token = json.loads(response.data)['token']
    
    return {'Authorization': f'Bearer {token}'}

class TestParcelAPI:
    def test_create_parcel_success(self, client, auth_headers):
        parcel_data = {
            'senderName': 'John Doe',
            'receiverName': 'Jane Smith',
            'pickupAddress': '123 Main St, New York, NY',
            'destinationAddress': '456 Oak Ave, Brooklyn, NY',
            'pickupCoords': {'lat': 40.7128, 'lng': -74.0060},
            'destinationCoords': {'lat': 40.6782, 'lng': -73.9442},
            'weight': 2.5,
            'price': 15.99
        }
        
        response = client.post('/api/parcels', 
                              json=parcel_data, 
                              headers=auth_headers)
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['senderName'] == 'John Doe'
        assert data['receiverName'] == 'Jane Smith'
        assert data['status'] == 'pending'
        assert 'trackingNumber' in data

    def test_create_parcel_missing_data(self, client, auth_headers):
        parcel_data = {
            'senderName': 'John Doe',
            # Missing required fields
        }
        
        response = client.post('/api/parcels', 
                              json=parcel_data, 
                              headers=auth_headers)
        
        assert response.status_code == 400

    def test_get_user_parcels(self, client, auth_headers):
        # Create a test parcel first
        user = User.query.filter_by(email='test@example.com').first()
        parcel = Parcel(
            tracking_number='TEST123',
            sender_name='John Doe',
            receiver_name='Jane Smith',
            pickup_address='123 Main St',
            destination_address='456 Oak Ave',
            pickup_lat=40.7128,
            pickup_lng=-74.0060,
            destination_lat=40.6782,
            destination_lng=-73.9442,
            weight=2.5,
            price=15.99,
            user_id=user.id
        )
        db.session.add(parcel)
        db.session.commit()
        
        response = client.get('/api/parcels', headers=auth_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 1
        assert data[0]['trackingNumber'] == 'TEST123'

    def test_get_parcel_details(self, client, auth_headers):
        user = User.query.filter_by(email='test@example.com').first()
        parcel = Parcel(
            tracking_number='TEST123',
            sender_name='John Doe',
            receiver_name='Jane Smith',
            pickup_address='123 Main St',
            destination_address='456 Oak Ave',
            pickup_lat=40.7128,
            pickup_lng=-74.0060,
            destination_lat=40.6782,
            destination_lng=-73.9442,
            weight=2.5,
            price=15.99,
            user_id=user.id
        )
        db.session.add(parcel)
        db.session.commit()
        
        response = client.get(f'/api/parcels/{parcel.id}', headers=auth_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['trackingNumber'] == 'TEST123'

    def test_update_parcel_success(self, client, auth_headers):
        user = User.query.filter_by(email='test@example.com').first()
        parcel = Parcel(
            tracking_number='TEST123',
            sender_name='John Doe',
            receiver_name='Jane Smith',
            pickup_address='123 Main St',
            destination_address='456 Oak Ave',
            pickup_lat=40.7128,
            pickup_lng=-74.0060,
            destination_lat=40.6782,
            destination_lng=-73.9442,
            weight=2.5,
            price=15.99,
            user_id=user.id,
            status='pending'
        )
        db.session.add(parcel)
        db.session.commit()
        
        update_data = {
            'receiverName': 'Updated Receiver',
            'destinationAddress': '789 New Address'
        }
        
        response = client.put(f'/api/parcels/{parcel.id}', 
                             json=update_data, 
                             headers=auth_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['receiverName'] == 'Updated Receiver'

    def test_update_delivered_parcel_fails(self, client, auth_headers):
        user = User.query.filter_by(email='test@example.com').first()
        parcel = Parcel(
            tracking_number='TEST123',
            sender_name='John Doe',
            receiver_name='Jane Smith',
            pickup_address='123 Main St',
            destination_address='456 Oak Ave',
            pickup_lat=40.7128,
            pickup_lng=-74.0060,
            destination_lat=40.6782,
            destination_lng=-73.9442,
            weight=2.5,
            price=15.99,
            user_id=user.id,
            status='delivered'
        )
        db.session.add(parcel)
        db.session.commit()
        
        update_data = {'receiverName': 'Updated Receiver'}
        
        response = client.put(f'/api/parcels/{parcel.id}', 
                             json=update_data, 
                             headers=auth_headers)
        
        assert response.status_code == 400

    def test_cancel_parcel_success(self, client, auth_headers):
        user = User.query.filter_by(email='test@example.com').first()
        parcel = Parcel(
            tracking_number='TEST123',
            sender_name='John Doe',
            receiver_name='Jane Smith',
            pickup_address='123 Main St',
            destination_address='456 Oak Ave',
            pickup_lat=40.7128,
            pickup_lng=-74.0060,
            destination_lat=40.6782,
            destination_lng=-73.9442,
            weight=2.5,
            price=15.99,
            user_id=user.id,
            status='pending'
        )
        db.session.add(parcel)
        db.session.commit()
        
        response = client.delete(f'/api/parcels/{parcel.id}', headers=auth_headers)
        
        assert response.status_code == 200
        
        # Verify parcel is cancelled
        updated_parcel = Parcel.query.get(parcel.id)
        assert updated_parcel.status == 'cancelled'

class TestAdminAPI:
    def test_admin_get_all_parcels(self, client, admin_headers):
        response = client.get('/api/admin/parcels', headers=admin_headers)
        assert response.status_code == 200

    def test_admin_update_parcel_status(self, client, admin_headers):
        # Create test parcel
        user = User(name='Test User', email='user@example.com', phone='+1234567890')
        user.set_password('password')
        db.session.add(user)
        db.session.commit()
        
        parcel = Parcel(
            tracking_number='TEST123',
            sender_name='John Doe',
            receiver_name='Jane Smith',
            pickup_address='123 Main St',
            destination_address='456 Oak Ave',
            pickup_lat=40.7128,
            pickup_lng=-74.0060,
            destination_lat=40.6782,
            destination_lng=-73.9442,
            weight=2.5,
            price=15.99,
            user_id=user.id,
            status='pending'
        )
        db.session.add(parcel)
        db.session.commit()
        
        update_data = {
            'status': 'in_transit',
            'location': 'En route to destination'
        }
        
        response = client.put(f'/api/admin/parcels/{parcel.id}/status', 
                             json=update_data, 
                             headers=admin_headers)
        
        assert response.status_code == 200
        
        # Verify status updated
        updated_parcel = Parcel.query.get(parcel.id)
        assert updated_parcel.status == 'in_transit'

    def test_non_admin_cannot_access_admin_endpoints(self, client, auth_headers):
        response = client.get('/api/admin/parcels', headers=auth_headers)
        assert response.status_code == 403