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

@parcel_bp.route('/<string:parcel_id>', methods=['GET'])
@jwt_required()
def get_parcel(parcel_id):
    user_id = get_jwt_identity()
    parcel= parcel_controller.get_parcel(user_id, parcel_id)
    return jsonify(parcel.to_dict())

@parcel_bp.route('/<string:parcel_id>', methods=['PUT'])
@jwt_required()
def update_parcel(parcel_id):
    user_id = get_jwt_identity()
    return parcel_controller.update_parcel(user_id, parcel_id, request.get_json())

@parcel_bp.route('/<string:parcel_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_parcel(parcel_id):
    user_id = get_jwt_identity()
    return parcel_controller.cancel_parcel(user_id, parcel_id)
@parcel_bp.route('/<string:parcel_id>/destination', methods=['PUT'])
@jwt_required()
def update_user_parcel_destination(parcel_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    destination = data.get('destination')
    if not destination:
        return jsonify({'error': 'Destination is required'}), 400

    return parcel_controller.update_user_parcel_destination(user_id, parcel_id, data)
@parcel_bp.route('/<string:parcel_id>/receiver', methods=['PUT'])
@jwt_required()
def updateParcelReceiver(parcel_id):
    data = request.get_json()
    parcel_id = request.view_args['parcel_id']
    receiverName = data.get('receiverName')
  

    if not receiverName :
        return jsonify({'error': 'At least one of receiverName '}), 400

    result = parcel_controller.update_receiver_details(parcel_id, receiverName)
    return jsonify(result)
@parcel_bp.route('/track/<string:tracking_number>', methods=['GET'])
def track_parcel(tracking_number):
    return parcel_controller.track_parcel(tracking_number)
