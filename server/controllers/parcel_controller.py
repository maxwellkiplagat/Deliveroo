import os
from flask import jsonify
from models import db, Parcel, Location, User
from utils.email import send_status_update_email
import uuid
import traceback 
from flask_jwt_extended import get_jwt_identity
import requests 
apiKey = os.getenv("VITE_GOOGLE_MAPS_API_KEY")
class ParcelController:
    def create_parcel(self, user_id, data):
        try:
            print("🚀 Incoming parcel data:", data)
            print("🧠 Authenticated user_id:", user_id)
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
            print("❌ ERROR:", e)
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

    def get_user_parcels(self, user_id):
        try:
            parcels = Parcel.query.filter_by(user_id=user_id).all()
            return jsonify([parcel.to_dict() for parcel in parcels]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_all_parcels(self):
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)

            if not user or user.role != 'admin':
                return jsonify({'error': 'Unauthorized'}), 403

            parcels = Parcel.query.all()
            return jsonify([parcel.to_dict() for parcel in parcels]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    
    def update_parcel_status(self, parcel_id, data):
        try:
            parcel = Parcel.query.get(parcel_id)
            if not parcel:
                return jsonify({'error': 'Parcel not found'}), 404

            old_status = parcel.status
            parcel.status = data['status']

            # Ensure SQLAlchemy is aware of the update
            db.session.add(parcel)  # <-- Add this to force update tracking

            location = Location(
                status=data['status'],
                location_description=data.get('location', 'Status updated'),
                parcel_id=parcel_id
            )
            db.session.add(location)

            db.session.commit()

            user = User.query.get(parcel.user_id)
            if user:
                send_status_update_email(user.email, parcel.tracking_number, old_status, data['status'])

            return jsonify(parcel.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    def cancel_parcel(self, user_id, parcel_id):
        try:
            parcel = Parcel.query.filter_by(id=parcel_id, user_id=user_id).first()
            if not parcel:
                return jsonify({'error': 'Parcel not found'}), 404

            parcel.status = 'cancelled'
            location = Location(
                status='cancelled',
                location_description='Parcel cancelled by user',
                parcel_id=parcel.id
            )
            db.session.add(location)
            db.session.commit()

            return jsonify({'message': 'Parcel cancelled successfully', 'parcel': parcel.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    def update_parcel(self, user_id, parcel_id, data):
        try:
            parcel = Parcel.query.filter_by(id=parcel_id, user_id=user_id).first()
            if not parcel:
                return jsonify({'error': 'Parcel not found'}), 404

            if parcel.status != 'pending':
                return jsonify({'error': 'Only pending parcels can be updated'}), 400

            # Update fields
            parcel.sender_name = data.get('senderName', parcel.sender_name)
            parcel.receiver_name = data.get('receiverName', parcel.receiver_name)
            parcel.weight = data.get('weight', parcel.weight)
            parcel.price = data.get('price', parcel.price)

            # Handle pickup address update
            new_pickup_address = data.get('pickupAddress')
            if new_pickup_address and new_pickup_address != parcel.pickup_address:
                parcel.pickup_address = new_pickup_address
                coords = self._geocode_address(new_pickup_address)
                if coords:
                    parcel.pickup_lat = coords['lat']
                    parcel.pickup_lng = coords['lng']

            # Handle destination address update
            new_dest_address = data.get('destinationAddress')
            if new_dest_address and new_dest_address != parcel.destination_address:
                parcel.destination_address = new_dest_address
                coords = self._geocode_address(new_dest_address)
                if coords:
                    parcel.destination_lat = coords['lat']
                    parcel.destination_lng = coords['lng']

            db.session.commit()

            return jsonify({'message': 'Parcel updated successfully', 'parcel': parcel.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    def update_parcel_location(self, parcel_id, data):
        try:
            parcel = Parcel.query.get(parcel_id)
            if not parcel:
                return jsonify({'error': 'Parcel not found'}), 404

            new_location = data.get('currentLocation')
            if not new_location or 'lat' not in new_location or 'lng' not in new_location:
                return jsonify({'error': 'Invalid currentLocation format'}), 400

            lat = float(new_location['lat'])
            lng = float(new_location['lng'])

            # Update current_lat and current_lng in Parcel table
            parcel.current_lat = lat
            parcel.current_lng = lng
            db.session.add(parcel)

            # Save location log entry
            location_entry = Location(
                status=parcel.status,
                location_description=f"Lat: {lat}, Lng: {lng}",  # Human-readable string
                latitude=lat,
                longitude=lng,
                parcel_id=parcel_id
            )
            db.session.add(location_entry)
            db.session.commit()

            return jsonify({'message': 'Parcel location updated', 'parcel': parcel.to_dict()}), 200

        except Exception as e:
            db.session.rollback()
            print(" Location update error:", e)
            return jsonify({'error': str(e)}), 500

    
    def update_user_parcel_destination(self, user_id, parcel_id, data):
        parcel = Parcel.query.get(parcel_id)
        if not parcel:
            return jsonify({'error': 'Parcel not found'}), 404

        if parcel.user_id != user_id:
            return jsonify({'error': 'Not authorized'}), 403

        if parcel.status != 'pending':
            return jsonify({'error': 'Parcel can no longer be updated'}), 400

        new_destination = data.get('destination')
        if not new_destination:
            return jsonify({'error': 'Destination is required'}), 400

       
        geo = self._geocode_address(new_destination)
        if not geo:
            return jsonify({'error': 'Geocoding failed'}), 500

        parcel.destination_address = new_destination
        parcel.destination_lat = geo['lat']
        parcel.destination_lng = geo['lng']
        db.session.commit()

        return jsonify({
            'message': 'Destination updated',
            'parcel': parcel.to_dict()
        }), 200
    def update_receiver_details(self, parcel_id, receiverName):
        parcel = Parcel.query.get(parcel_id)
        if not parcel:
            return {'error': 'Parcel not found'}, 404

        if receiverName:
            parcel.receiver_name = receiverName

        db.session.commit()
        return parcel.to_dict(), 200
    def track_parcel(self, tracking_number):
        parcel = Parcel.query.filter_by(tracking_number=tracking_number).first()
        if not parcel:
            return jsonify({"error": "Parcel not found"}), 404
        return jsonify(parcel.to_dict()), 200


    def _geocode_address(self, address):
        try:
            API_KEY = apiKey
  
            response = requests.get(f'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}')
            res_json = response.json()
            if res_json['status'] == 'OK':
                location = res_json['results'][0]['geometry']['location']
                return {'lat': location['lat'], 'lng': location['lng']}
        except Exception as e:
            print(f'Geocoding failed for "{address}":', e)
        return None
