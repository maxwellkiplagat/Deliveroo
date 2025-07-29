import os
from datetime import timedelta

class Config:
  SECRET_KEY = os.environ.get('SECRET_KEY') or '4dea5666bafbe5d37fa275114a1285968b00ee944d3f22c232f36ff8723e594c'
  
  # 👇 Update this line to match your database credentials
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://brian:3995@localhost:5432/deliveroo'
  
  SQLALCHEMY_TRACK_MODIFICATIONS = False

  JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

  # Email configuration
  MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
  MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
  MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
  MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
  MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

  # Google Maps API
  GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')
