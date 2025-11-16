<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicationAcceptedEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $volunteerName;
    public $opportunityTitle;
    public $organizationName;
    public $applicationId;

    public function __construct($volunteerName, $opportunityTitle, $organizationName, $applicationId)
    {
        $this->volunteerName = $volunteerName;
        $this->opportunityTitle = $opportunityTitle;
        $this->organizationName = $organizationName;
        $this->applicationId = $applicationId;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Application Accepted - ' . $this->opportunityTitle,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.application_accepted',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
