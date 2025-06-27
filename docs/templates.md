# Templates

This document provides an overview of the HTML email templates used in the application.

## `emailVerification.template.html`

This template is used for the email verification process. It contains a placeholder `{{verificationLink}}` which is replaced with a unique verification link for each user.

### Content

- A clear heading indicating that it is an email verification message.
- A call-to-action button that links to the verification URL.
- A message for users who did not initiate the registration.

## `passwordReset.template.html`

This template is used for the password reset process. It contains a placeholder `{{resetLink}}` which is replaced with a unique password reset link.

### Content

- A clear heading for the password reset request.
- A call-to-action button that links to the password reset page.
- A notice that the link will expire in 10 minutes.
- A message for users who did not request a password reset.
