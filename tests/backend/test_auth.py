import pytest
import json
from server.app import create_app
from server.models import db, User
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

class TestAuthAPI:
    def test_register_success(self, client):
        user_data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123',
            'phone': '+1234567890'
        }
        
        response = client.post('/api/auth/register', json=user_data)
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'user' in data
        assert 'token' in data
        assert data['user']['email'] == 'john@example.com'
        assert data['user']['name'] == 'John Doe'

    def test_register_duplicate_email(self, client):
        user_data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123',
            'phone': '+1234567890'
        }
        
        # Register first user
        client.post('/api/auth/register', json=user_data)
        
        # Try to register with same email
        response = client.post('/api/auth/register', json=user_data)
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data

    def test_register_missing_fields(self, client):
        user_data = {
            'name': 'John Doe',
            'email': 'john@example.com'
            # Missing password and phone
        }
        
        response = client.post('/api/auth/register', json=user_data)
        assert response.status_code == 400

    def test_login_success(self, client):
        # Create user first
        user = User(name='John Doe', email='john@example.com', phone='+1234567890')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        
        login_data = {
            'email': 'john@example.com',
            'password': 'password123'
        }
        
        response = client.post('/api/auth/login', json=login_data)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'user' in data
        assert 'token' in data
        assert data['user']['email'] == 'john@example.com'

    def test_login_invalid_credentials(self, client):
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'wrongpassword'
        }
        
        response = client.post('/api/auth/login', json=login_data)
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'error' in data

    def test_login_wrong_password(self, client):
        # Create user first
        user = User(name='John Doe', email='john@example.com', phone='+1234567890')
        user.set_password('correctpassword')
        db.session.add(user)
        db.session.commit()
        
        login_data = {
            'email': 'john@example.com',
            'password': 'wrongpassword'
        }
        
        response = client.post('/api/auth/login', json=login_data)
        
        assert response.status_code == 401

    def test_get_profile_success(self, client):
        # Create and login user
        user = User(name='John Doe', email='john@example.com', phone='+1234567890')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        
        login_response = client.post('/api/auth/login', 
                                   json={'email': 'john@example.com', 'password': 'password123'})
        token = json.loads(login_response.data)['token']
        
        headers = {'Authorization': f'Bearer {token}'}
        response = client.get('/api/auth/profile', headers=headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['email'] == 'john@example.com'
        assert data['name'] == 'John Doe'

    def test_get_profile_no_token(self, client):
        response = client.get('/api/auth/profile')
        assert response.status_code == 401

    def test_get_profile_invalid_token(self, client):
        headers = {'Authorization': 'Bearer invalid-token'}
        response = client.get('/api/auth/profile', headers=headers)
        assert response.status_code == 401