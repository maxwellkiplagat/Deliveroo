from marshmallow import Schema, fields, validate, validates, ValidationError

class CoordinatesSchema(Schema):
    lat = fields.Float(required=True, validate=validate.Range(min=-90, max=90))
    lng = fields.Float(required=True, validate=validate.Range(min=-180, max=180))

class ParcelCreateSchema(Schema):
    sender_name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    receiver_name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    pickup_address = fields.Str(required=True, validate=validate.Length(min=5, max=500))
    destination_address = fields.Str(required=True, validate=validate.Length(min=5, max=500))
    pickup_coords = fields.Nested(CoordinatesSchema, required=True)
    destination_coords = fields.Nested(CoordinatesSchema, required=True)
    weight = fields.Float(required=True, validate=validate.Range(min=0.1, max=1000))
    price = fields.Float(required=True, validate=validate.Range(min=0.01))

class ParcelUpdateSchema(Schema):
    receiver_name = fields.Str(validate=validate.Length(min=2, max=100))
    destination_address = fields.Str(validate=validate.Length(min=5, max=500))
    destination_coords = fields.Nested(CoordinatesSchema)

class ParcelStatusUpdateSchema(Schema):
    status = fields.Str(required=True, validate=validate.OneOf([
        'pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'
    ]))
    location = fields.Str(validate=validate.Length(max=255))

class ParcelLocationUpdateSchema(Schema):
    latitude = fields.Float(required=True, validate=validate.Range(min=-90, max=90))
    longitude = fields.Float(required=True, validate=validate.Range(min=-180, max=180))
    location_description = fields.Str(validate=validate.Length(max=255))

class LocationResponseSchema(Schema):
    id = fields.Int()
    status = fields.Str()
    location = fields.Str()
    coordinates = fields.Nested(CoordinatesSchema)
    timestamp = fields.DateTime()

class ParcelResponseSchema(Schema):
    id = fields.Int()
    tracking_number = fields.Str()
    sender_name = fields.Str()
    receiver_name = fields.Str()
    pickup_address = fields.Str()
    destination_address = fields.Str()
    pickup_coords = fields.Nested(CoordinatesSchema)
    destination_coords = fields.Nested(CoordinatesSchema)
    current_location = fields.Nested(CoordinatesSchema, allow_none=True)
    weight = fields.Float()
    price = fields.Float()
    status = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    user_id = fields.Int()
    timeline = fields.List(fields.Nested(LocationResponseSchema))