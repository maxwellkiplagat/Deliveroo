from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate

from config import Config
from models import db, User
from routes.auth_routes import auth_bp
from routes.parcel_routes import parcel_bp
from routes.admin_routes import admin_bp

migrate = Migrate()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Override Config so JWTs work via both Authorization headers and cookies
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
    app.config["JWT_COOKIE_SECURE"] = True
    app.config["JWT_COOKIE_SAMESITE"] = "None"
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False

    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": "https://deliveroo-frontend-t4xb.onrender.com"
        }
    })

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    mail.init_app(app)

    # Create database tables and ensure admin account exists when Gunicorn boots
    with app.app_context():
        db.create_all()

        # Promote existing user to admin if registered
        existing_user = User.query.filter_by(email="maxwellkiplagat0@gmail.com").first()
        if existing_user and existing_user.role != "admin":
            existing_user.role = "admin"
            db.session.commit()

        # Create default admin user if not already in database
        if not User.query.filter_by(email="admin@deliveroo.com").first():
            admin_user = User(
                name="Deliveroo Admin",
                email="admin@deliveroo.com",
                phone="0700000000",
                role="admin"
            )
            admin_user.set_password("Admin@123")
            db.session.add(admin_user)
            db.session.commit()

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(parcel_bp, url_prefix='/api/parcels')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Root route
    @app.route('/')
    def index():
        return jsonify({"message": "Deliveroo API is alive 🚀"})

    # Error handling
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

# Entry point
if __name__ == '__main__':
    app = create_app()
    app.run(debug=False, host='0.0.0.0', port=5000)
