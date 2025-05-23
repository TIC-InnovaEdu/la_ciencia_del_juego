import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText

def enviar_factura(destinatario, asunto, cuerpo, archivo_factura):
    # Configura los datos del servidor y el remitente
    smtp_servidor = 'smtp.tuservidor.com'
    smtp_puerto = 587
    remitente = 'tu_email@ejemplo.com'
    contraseña = 'tu_contraseña'

    # Crea el objeto del mensaje
    mensaje = MIMEMultipart()
    mensaje['From'] = remitente
    mensaje['To'] = destinatario
    mensaje['Subject'] = asunto

    # Agrega el cuerpo del mensaje
    mensaje.attach(MIMEText(cuerpo, 'plain'))

    # Adjunta la factura
    with open(archivo_factura, 'rb') as archivo:
        parte_adjunto = MIMEApplication(archivo.read(), Name=archivo_factura)
    parte_adjunto['Content-Disposition'] = f'attachment; filename="{archivo_factura}"'
    mensaje.attach(parte_adjunto)

    # Envía el correo
    with smtplib.SMTP(smtp_servidor, smtp_puerto) as servidor:
        servidor.starttls()
        servidor.login(remitente, contraseña)
        servidor.send_message(mensaje)

# Datos de la factura
destinatario = 'cliente@ejemplo.com'
asunto = 'Factura Adjunta'
cuerpo = 'Adjunto encontrarás la factura correspondiente.'
archivo_factura = 'ruta/a/tu/factura.pdf'

# Enviar la factura
enviar_factura(destinatario, asunto, cuerpo, archivo_factura)
