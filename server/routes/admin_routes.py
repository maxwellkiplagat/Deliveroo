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