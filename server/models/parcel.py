from datetime import datetime
from . import db

class Parcel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tracking_number = db.Column(db.String(50), unique=True, nullable=False)
    sender_name = db.Column(db.String(100), nullable=False)
    receiver_name = db.Column(db.String(100), nullable=False)
    pickup_address = db.Column(db.Text, nullable=False)
    destination_address = db.Column(db.Text, nullable=False)
    pickup_lat = db.Column(db.Float, nullable=False)
    pickup_lng = db.Column(db.Float, nullable=False)
    destination_lat = db.Column(db.Float, nullable=False)
    destination_lng = db.Column(db.Float, nullable=False)
    current_lat = db.Column(db.Float)
    current_lng = db.Column(db.Float)
    weight = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, picked_up, in_transit, delivered, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    locations = db.relationship('Location', backref='parcel', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'trackingNumber': self.tracking_number,
            'senderName': self.sender_name,
            'receiverName': self.receiver_name,
            'pickupAddress': self.pickup_address,
            'destinationAddress': self.destination_address,
            'pickupCoords': {'lat': self.pickup_lat, 'lng': self.pickup_lng},
            'destinationCoords': {'lat': self.destination_lat, 'lng': self.destination_lng},
            'currentLocation': {'lat': self.current_lat, 'lng': self.current_lng} if self.current_lat else None,
            'weight': self.weight,
            'price': self.price,
            'status': self.status,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
            'userId': self.user_id,
            'timeline': [location.to_dict() for location in self.locations]
        }