import React from 'react';

const AccountDeletion = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Request Account and Data Deletion for [BestPick]</h1>
      <p>If you wish to delete your account and associated data, please follow the steps below:</p>
      <ol>
        <li>
          Send an email to <a href="mailto:bestpick050@gmail.com">bestpick050@gmail.com</a> with the subject "Account Deletion Request".
        </li>
        <li>
          Include your account details (e.g., username or email) in the message.
        </li>
      </ol>
      <p>
        Data deleted upon account deletion includes personal data, usage data, and account details. Some data may be retained for legal or business requirements for a period of time.
      </p>
    </div>
  );
};

export default AccountDeletion;
