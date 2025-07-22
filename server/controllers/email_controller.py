from flask import current_app
from flask_mail import Message
from server.utils.email import mail
import threading

class EmailController:
    @staticmethod
    def send_async_email(app, msg):
        """Send email asynchronously"""
        with app.app_context():
            try:
                mail.send(msg)
            except Exception as e:
                current_app.logger.error(f'Failed to send email: {str(e)}')

    def send_email(self, subject, recipients, html_body, text_body=None):
        """Send email with async support"""
        msg = Message(
            subject=subject,
            sender=current_app.config['MAIL_USERNAME'],
            recipients=recipients if isinstance(recipients, list) else [recipients]
        )
        msg.html = html_body
        if text_body:
            msg.body = text_body
        
        # Send email asynchronously
        thread = threading.Thread(
            target=self.send_async_email,
            args=(current_app._get_current_object(), msg)
        )
        thread.start()

    def send_welcome_email(self, user_email, user_name):
        """Send welcome email to new user"""
        subject = 'Welcome to Deliveroo!'
        html_body = f'''
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to Deliveroo!</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
                <h2 style="color: #333;">Hello {user_name}!</h2>
                <p style="color: #666; line-height: 1.6;">
                    Thank you for joining Deliveroo, your trusted parcel delivery service.
                </p>
                <p style="color: #666; line-height: 1.6;">
                    You can now create and track your parcels through our platform. 
                    Our team is committed to providing you with fast, reliable, and secure delivery services.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3000/dashboard" 
                       style="background: #10b981; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Go to Dashboard
                    </a>
                </div>
                <p style="color: #666; line-height: 1.6;">
                    If you have any questions, feel free to contact our support team.
                </p>
                <p style="color: #666;">
                    Best regards,<br>
                    The Deliveroo Team
                </p>
            </div>
        </div>
        '''
        self.send_email(subject, user_email, html_body)

    def send_status_update_email(self, user_email, tracking_number, old_status, new_status):
        """Send status update email to user"""
        status_messages = {
            'pending': 'Your parcel is pending pickup',
            'picked_up': 'Your parcel has been picked up',
            'in_transit': 'Your parcel is on its way',
            'delivered': 'Your parcel has been delivered',
            'cancelled': 'Your parcel has been cancelled'
        }
        
        subject = f'Parcel Update - {tracking_number}'
        html_body = f'''
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Parcel Status Update</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
                <h2 style="color: #333;">Tracking Number: {tracking_number}</h2>
                <p style="color: #666; line-height: 1.6;">
                    Your parcel status has been updated:
                </p>
                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0; color: #666;">
                        <strong>Previous Status:</strong> 
                        <span style="color: #f59e0b; text-transform: capitalize;">
                            {old_status.replace('_', ' ')}
                        </span>
                    </p>
                    <p style="margin: 10px 0 0 0; color: #666;">
                        <strong>Current Status:</strong> 
                        <span style="color: #10b981; text-transform: capitalize;">
                            {new_status.replace('_', ' ')}
                        </span>
                    </p>
                </div>
                <p style="color: #666; line-height: 1.6;">
                    {status_messages.get(new_status, 'Status updated')}
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3000/dashboard" 
                       style="background: #10b981; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Track Your Parcel
                    </a>
                </div>
                <p style="color: #666;">
                    Best regards,<br>
                    The Deliveroo Team
                </p>
            </div>
        </div>
        '''
        self.send_email(subject, user_email, html_body)

    def send_location_update_email(self, user_email, tracking_number, location):
        """Send location update email to user"""
        subject = f'Location Update - {tracking_number}'
        html_body = f'''
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Location Update</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
                <h2 style="color: #333;">Tracking Number: {tracking_number}</h2>
                <p style="color: #666; line-height: 1.6;">
                    Your parcel location has been updated:
                </p>
                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0; color: #666;">
                        <strong>Current Location:</strong> {location}
                    </p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3000/dashboard" 
                       style="background: #10b981; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        View on Map
                    </a>
                </div>
                <p style="color: #666;">
                    Best regards,<br>
                    The Deliveroo Team
                </p>
            </div>
        </div>
        '''
        self.send_email(subject, user_email, html_body)