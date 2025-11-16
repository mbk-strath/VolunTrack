<!DOCTYPE html>
<html>
<head>
    <title>Application Accepted</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #28a745;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
            text-align: center;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Application Accepted!</h1>
        </div>
        <div class="content">
            <p>Hi {{ $volunteerName }},</p>
            
            <p>Great news! Your application for the opportunity has been <strong>accepted</strong>!</p>
            
            <h3>Opportunity Details:</h3>
            <ul>
                <li><strong>Opportunity:</strong> {{ $opportunityTitle }}</li>
                <li><strong>Organization:</strong> {{ $organizationName }}</li>
                <li><strong>Application ID:</strong> #{{ $applicationId }}</li>
            </ul>
            
            <p>Thank you for your interest and we look forward to working with you on this exciting opportunity. Please check the platform for more details and next steps.</p>
            
            <p>If you have any questions, please don't hesitate to reach out to us.</p>
            
            <div class="footer">
                <p>Best regards,<br>VolunTrack Team</p>
                <p>This is an automated email. Please do not reply to this email.</p>
            </div>
        </div>
    </div>
</body>
</html>
