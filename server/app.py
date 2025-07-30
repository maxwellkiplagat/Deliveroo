from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate  


from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.parcel_routes import parcel_bp
from routes.admin_routes import admin_bp


migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config['DEBUG'] = True
    app.config['PROPAGATE_EXCEPTIONS'] = True 
    app.config.from_object(Config)
    
    
    db.init_app(app)
    migrate.init_app(app, db)  
    JWTManager(app)
    Mail(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])
    
    from routes.auth_routes import auth_bp
    from routes.parcel_routes import parcel_bp
    from routes.admin_routes import admin_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(parcel_bp, url_prefix='/api/parcels')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
     @app.route('/')
    def index():
        return {"message": "Deliveroo API is alive 🚀"}

    
    
    return app


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=False)
