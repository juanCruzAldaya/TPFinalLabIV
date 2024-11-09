import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_confirmation_email(user_email, token):
    sender_email = "juance.aladaya@live.com.ar"
    receiver_email = user_email
    password = "658796Juan"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Confirma tu registro"
    message["From"] = sender_email
    message["To"] = receiver_email

    text = f"Por favor, confirma tu registro haciendo clic en el siguiente enlace: http://localhost:8000/confirm/{token}"
    part = MIMEText(text, "plain")
    message.attach(part)

    with smtplib.SMTP_SSL("smtp.example.com", 465) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())
