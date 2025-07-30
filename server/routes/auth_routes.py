from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from controllers.auth_controller import AuthController

auth_bp = Blueprint('auth', __name__)
auth_controller = AuthController()

@auth_bp.route('/register', methods=['POST'])
def register():
    return auth_controller.register(request.get_json())

@auth_bp.route('/login', methods=['POST'])
def login():
    return auth_controller.login(request.get_json())

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    return auth_controller.get_profile(user_id)