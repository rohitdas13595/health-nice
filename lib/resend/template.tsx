import * as React from 'react';

interface EmailTemplateProps {
    name: string;
  otp: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  otp,
}) => (
  <div>
    <h1>Hi 👋 {name} !</h1>
    <h1>Your Otp is, {otp}.</h1>

    <p>Thank you!</p>
  </div>
);
