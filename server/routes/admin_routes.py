# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from server.controllers.parcel_controller import ParcelController
# from utils.decorators import admin_required

# admin_bp = Blueprint('admin', __name__)
# parcel_controller = ParcelController()

# @admin_bp.route('/parcels', methods=['GET'])
# @jwt_required(optional=True)
# @admin_required
# def get_all_parcels():
#     if request.method == 'OPTIONS':
#         return jsonify({'ok': True}), 200
#     return parcel_controller.get_all_parcels()

# @admin_bp.route('/parcels/<string:parcel_id>/status', methods=['PUT'])
# @jwt_required()
# @admin_required
# def update_parcel_status(parcel_id):
#     return parcel_controller.update_parcel_status(parcel_id, request.get_json())

# @admin_bp.route('/parcels/<string:parcel_id>/location', methods=['PUT'])
# @jwt_required()
# @admin_required
# def update_parcel_location(parcel_id):
#     return parcel_controller.update_parcel_location(parcel_id, request.get_json())

# @admin_bp.route('/analytics', methods=['GET'])
# @jwt_required()
# @admin_required
# def get_analytics():
#     return parcel_controller.get_analytics()
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.controllers.parcel_controller import ParcelController
from utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__)
parcel_controller = ParcelController()

# Define valid status values
VALID_STATUSES = {'pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'}

@admin_bp.route('/parcels', methods=['GET'])
@jwt_required(optional=True)
@admin_required
def get_all_parcels():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True}), 200
    return parcel_controller.get_all_parcels()

@admin_bp.route('/parcels/<string:parcel_id>/status', methods=['PUT'])
@jwt_required()
@admin_required
def update_parcel_status(parcel_id):
    data = request.get_json()
    
    # Validate input
    if 'status' not in data:
        return jsonify({'error': 'Status field is required'}), 400
        
    status = data['status']
    
    if status is None:
        return jsonify({'error': 'Status cannot be null'}), 400
        
    if status not in VALID_STATUSES:
        return jsonify({
            'error': f'Invalid status value. Valid values are: {", ".join(VALID_STATUSES)}'
        }), 400
    
    return parcel_controller.update_parcel_status(parcel_id, data)

@admin_bp.route('/parcels/<string:parcel_id>/location', methods=['PUT'])
@jwt_required()
@admin_required
def update_parcel_location(parcel_id):
    data = request.get_json()
    
    # Validate location data
    if 'currentLocation' not in data:
        return jsonify({'error': 'currentLocation field is required'}), 400
        
    location = data['currentLocation']
    
    if not location or 'lat' not in location or 'lng' not in location:
        return jsonify({'error': 'Invalid location format. Requires {lat: number, lng: number}'}), 400
        
    try:
        lat = float(location['lat'])
        lng = float(location['lng'])
    except (TypeError, ValueError):
        return jsonify({'error': 'Latitude and longitude must be numbers'}), 400
    
    return parcel_controller.update_parcel_location(parcel_id, data)

@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
@admin_required
def get_analytics():
    return parcel_controller.get_analytics()