import threading
from flask import current_app, jsonify, make_response
from flask_jwt_extended import create_access_token
from models import db, User
from utils.email import send_welcome_email

class AuthController:
    def _send_email_async(self, app, email, name):
        with app.app_context():
            try:
                send_welcome_email(email, name)
            except Exception as e:
                print(f"Welcome email failed (non-blocking): {e}")

    def register(self, data):
        try:
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already registered'}), 400
            
            user = User(
                name=data['name'],
                email=data['email'],
                phone=data['phone']
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            app = current_app._get_current_object()
            threading.Thread(
                target=self._send_email_async,
                args=(app, user.email, user.name),
                daemon=True
            ).start()
            
            access_token = create_access_token(identity=str(user.id))
            response = make_response(jsonify({
                'user': user.to_dict(),
                'access_token': access_token
            }), 200)
            response.set_cookie(
                "access_token_cookie",
                access_token,
                httponly=True,
                secure=True,
                samesite="None"
            )
            return response
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    def login(self, data):
        try:
            user = User.query.filter_by(email=data['email']).first()
            
            if not user or not user.check_password(data['password']):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            access_token = create_access_token(identity=str(user.id))
            response = make_response(jsonify({
                'user': user.to_dict(),
                'access_token': access_token
            }), 200)
            response.set_cookie(
                "access_token_cookie",
                access_token,
                httponly=True,
                secure=True,
                samesite="None"
            )
            return response
                    
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_profile(self, user_id):
        try:
            user = User.query.get(int(user_id))
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify(user.to_dict()), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
