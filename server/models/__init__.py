from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .parcel import Parcel
from .location import Location
__all__ = ['db', 'User', 'Parcel', 'Location']
