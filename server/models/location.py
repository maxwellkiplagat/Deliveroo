from datetime import datetime
from .. import db

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), nullable=False)
    location_description = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    # Foreign keys
    parcel_id = db.Column(db.Integer, db.ForeignKey('parcel.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'status': self.status,
            'location': self.location_description,
            'coordinates': {'lat': self.latitude, 'lng': self.longitude} if self.latitude else None,
            'timestamp': self.timestamp.isoformat()
        }
