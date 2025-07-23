from flask import current_app
from flask_mail import Message, Mail

mail = Mail()

def send_welcome_email(email, name):
    """Send welcome email to new user"""
    try:
        msg = Message(
            subject='Welcome to Deliveroo!',
            sender=current_app.config['MAIL_USERNAME'],
            recipients=[email]
        )
        msg.html = f"""
        <h2>Welcome to Deliveroo, {name}!</h2>
        <p>Thank you for joining our parcel delivery service.</p>
        <p>You can now create and track your parcels through our platform.</p>
        <p>Best regards,<br>The Deliveroo Team</p>
        """
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False

def send_status_update_email(email, tracking_number, old_status, new_status):
    """Send status update email to user"""
    try:
        msg = Message(
            subject=f'Parcel Update - {tracking_number}',
            sender=current_app.config['MAIL_USERNAME'],
            recipients=[email]
        )
        msg.html = f"""
        <h2>Parcel Status Update</h2>
        <p>Your parcel <strong>{tracking_number}</strong> status has been updated.</p>
        <p>Previous status: <strong>{old_status}</strong></p>
        <p>Current status: <strong>{new_status}</strong></p>
        <p>Track your parcel at: <a href="http://localhost:3000">Deliveroo</a></p>
        <p>Best regards,<br>The Deliveroo Team</p>
        """
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending status update email: {e}")
        return False