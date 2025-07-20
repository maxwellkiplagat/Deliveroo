from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.parcel_controller import ParcelController
from utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__)
parcel_controller = ParcelController()

@admin_bp.route('/parcels', methods=['GET'])
@jwt_required()
@admin_required
def get_all_parcels():
    return parcel_controller.get_all_parcels()

@admin_bp.route('/parcels/<int:parcel_id>/status', methods=['PUT'])
@jwt_required()
@admin_required
def update_parcel_status(parcel_id):
    return parcel_controller.update_parcel_status(parcel_id, request.get_json())

@admin_bp.route('/parcels/<int:parcel_id>/location', methods=['PUT'])
@jwt_required()
@admin_required
def update_parcel_location(parcel_id):
    return parcel_controller.update_parcel_location(parcel_id, request.get_json())