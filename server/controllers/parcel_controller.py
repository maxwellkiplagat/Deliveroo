from flask import jsonify
from models import db, Parcel, Location, User
from utils.email import send_status_update_email
import uuid

class ParcelController:
    def create_parcel(self, user_id, data):
        try:
            # Generate tracking number
            tracking_number = f"DEL{str(uuid.uuid4())[:8].upper()}"
            
            parcel = Parcel(
                tracking_number=tracking_number,
                sender_name=data['senderName'],
                receiver_name=data['receiverName'],
                pickup_address=data['pickupAddress'],
                destination_address=data['destinationAddress'],
                pickup_lat=data['pickupCoords']['lat'],
                pickup_lng=data['pickupCoords']['lng'],
                destination_lat=data['destinationCoords']['lat'],
                destination_lng=data['destinationCoords']['lng'],
                weight=data['weight'],
                price=data['price'],
                user_id=user_id
            )
            
            db.session.add(parcel)
            db.session.commit()
            
            # Create initial location entry
            location = Location(
                status='pending',
                location_description=data['pickupAddress'],
                latitude=data['pickupCoords']['lat'],
                longitude=data['pickupCoords']['lng'],
                parcel_id=parcel.id
            )
            db.session.add(location)
            db.session.commit()
            
            return jsonify(parcel.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    def get_user_parcels(self, user_id):
        try:
            parcels = Parcel.query.filter_by(user_id=user_id).all()
            return jsonify([parcel.to_dict() for parcel in parcels]), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_all_parcels(self):
        try:
            parcels = Parcel.query.all()
            return jsonify([parcel.to_dict() for parcel in parcels]), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def update_parcel_status(self, parcel_id, data):
        try:
            parcel = Parcel.query.get(parcel_id)
            if not parcel:
                return jsonify({'error': 'Parcel not found'}), 404
            
            # Update status
            old_status = parcel.status
            parcel.status = data['status']
            
            # Add location entry
            location = Location(
                status=data['status'],
                location_description=data.get('location', 'Status updated'),
                parcel_id=parcel_id
            )
            db.session.add(location)
            db.session.commit()
            
            # Send email notification
            user = User.query.get(parcel.user_id)
            if user:
                send_status_update_email(user.email, parcel.tracking_number, old_status, data['status'])
            
            return jsonify(parcel.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500