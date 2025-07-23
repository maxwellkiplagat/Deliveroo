from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.parcel_controller import ParcelController

parcel_bp = Blueprint('parcels', __name__)
parcel_controller = ParcelController()

@parcel_bp.route('', methods=['GET'])
@jwt_required()
def get_parcels():
    user_id = get_jwt_identity()
    return parcel_controller.get_user_parcels(user_id)

@parcel_bp.route('', methods=['POST'])
@jwt_required()
def create_parcel():
    user_id = get_jwt_identity()
    return parcel_controller.create_parcel(user_id, request.get_json())

@parcel_bp.route('/<int:parcel_id>', methods=['GET'])
@jwt_required()
def get_parcel(parcel_id):
    user_id = get_jwt_identity()
    return parcel_controller.get_parcel(user_id, parcel_id)

@parcel_bp.route('/<int:parcel_id>', methods=['PUT'])
@jwt_required()
def update_parcel(parcel_id):
    user_id = get_jwt_identity()
    return parcel_controller.update_parcel(user_id, parcel_id, request.get_json())

@parcel_bp.route('/<int:parcel_id>', methods=['DELETE'])
@jwt_required()
def cancel_parcel(parcel_id):
    user_id = get_jwt_identity()
    return parcel_controller.cancel_parcel(user_id, parcel_id)