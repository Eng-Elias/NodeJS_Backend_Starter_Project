# Services

This document provides an overview of the services used in the application.

## `EmailService.ts`

This file defines the `EmailService` class, which is responsible for sending emails. It is designed to be used by background workers to handle email delivery asynchronously.

### Key Features

- **Nodemailer Integration**: Uses the `nodemailer` library to send emails via an SMTP server.
- **Lazy Initialization**: The `transporter` object is initialized only when it is first needed, which improves application startup time.
- **Configuration-Based**: The email service is configured using the values from the main `config` object. If the required email settings are not provided, the service will not be initialized, and a warning will be logged.
- **`sendEmail` Method**: A static method that sends an email with the specified recipient, subject, and HTML body.
