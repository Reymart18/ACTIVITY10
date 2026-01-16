import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure your email service here
    // For development, you can use ethereal.email or mailtrap.io
    // For production, use Gmail, SendGrid, AWS SES, etc.
    
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER || 'your-email@gmail.com',
        pass: process.env.MAIL_PASSWORD || 'your-app-password',
      },
    });
  }

  async sendTicketEmail(
    recipientEmail: string,
    recipientName: string,
    ticketData: {
      eventTitle: string;
      eventLocation: string;
      eventDate: Date;
      referenceCode: string;
      seatType: string;
      ticketId: number;
      eventId: number;
    },
  ) {
    try {
      // Generate QR Code as buffer for email attachment
      const qrData = JSON.stringify({
        type: 'EVENT_TICKET',
        ticketId: ticketData.ticketId,
        referenceCode: ticketData.referenceCode,
        eventId: ticketData.eventId,
      });

      const qrCodeBuffer = await QRCode.toBuffer(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Format date
      const eventDateFormatted = new Date(ticketData.eventDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Seat type display
      const seatTypeDisplay = ticketData.seatType === 'vip' ? '👑 VIP' : '🪑 Standard';

      // Email HTML template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Event Ticket</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #249E94 0%, #1f8b82 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 30px;
            }
            .ticket-box {
              background: #f9fafb;
              border: 2px dashed #d1d5db;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .qr-code {
              margin: 20px auto;
              padding: 15px;
              background: white;
              border-radius: 8px;
              display: inline-block;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .qr-code img {
              display: block;
              max-width: 100%;
              height: auto;
            }
            .reference-code {
              font-size: 24px;
              font-weight: bold;
              color: #249E94;
              letter-spacing: 2px;
              margin: 15px 0;
              font-family: monospace;
            }
            .event-details {
              background: #f9fafb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .detail-row {
              margin: 12px 0;
              display: flex;
              align-items: flex-start;
            }
            .detail-label {
              font-weight: bold;
              min-width: 120px;
              color: #666;
            }
            .detail-value {
              color: #333;
              flex: 1;
            }
            .seat-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 14px;
            }
            .seat-vip {
              background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
              color: white;
            }
            .seat-standard {
              background: linear-gradient(135deg, #249E94 0%, #1f8b82 100%);
              color: white;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background: #f9fafb;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: linear-gradient(135deg, #249E94 0%, #1f8b82 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: bold;
            }
            .alert {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Your Event Ticket</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Registration Confirmed!</p>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Hello <strong>${recipientName}</strong>,</p>
              <p style="color: #666; margin-top: 0;">Thank you for registering! Your ticket for <strong>${ticketData.eventTitle}</strong> is ready.</p>
              <p style="color: #d97706; font-weight: 600; background: #fef3c7; padding: 12px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
                ⚠️ <strong>Important:</strong> After 5 minutes, cancellation will not be available anymore!
              </p>
              
              <div class="ticket-box">
                <h2 style="margin: 0 0 20px 0; color: #249E94;">🎉 ${ticketData.eventTitle}</h2>
                
                <div class="qr-code">
                  <img src="cid:qrcode" alt="QR Code" width="250" height="250" />
                </div>
                
                <p style="font-size: 12px; color: #666; margin: 10px 0;">Scan this QR code at the event to check in</p>
                
                <div class="reference-code">
                  ${ticketData.referenceCode}
                </div>
                
                <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Reference Code</p>
              </div>
              
              <div class="event-details">
                <h3 style="margin: 0 0 15px 0; color: #333;">📋 Event Details</h3>
                
                <div class="detail-row">
                  <span class="detail-label">📅 Date & Time:</span>
                  <span class="detail-value">${eventDateFormatted}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">📍 Location:</span>
                  <span class="detail-value">${ticketData.eventLocation}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">🎫 Ticket ID:</span>
                  <span class="detail-value">#${ticketData.ticketId}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">🪑 Seat Type:</span>
                  <span class="detail-value">
                    <span class="seat-badge ${ticketData.seatType === 'vip' ? 'seat-vip' : 'seat-standard'}">
                      ${seatTypeDisplay}
                    </span>
                  </span>
                </div>
              </div>
              
              <div class="alert">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Present this QR code at the event entrance</li>
                  <li>Keep your reference code safe: <strong>${ticketData.referenceCode}</strong></li>
                  <li>This ticket is valid for single entry only</li>
                  <li>Screenshots of the QR code are acceptable</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="http://localhost:5173/attendee/tickets" class="button">
                  View My Tickets
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you have any questions, please contact the event organizer.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">© 2026 Event Management System</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">
                This is an automated email. Please do not reply.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email with QR code as attachment
      const info = await this.transporter.sendMail({
        from: `"Event Management" <${process.env.MAIL_USER || 'noreply@events.com'}>`,
        to: recipientEmail,
        subject: `🎫 Your Ticket for ${ticketData.eventTitle}`,
        html: htmlContent,
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeBuffer,
            cid: 'qrcode', // Same CID as referenced in HTML
            contentType: 'image/png',
          },
        ],
      });

      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw error to prevent registration failure if email fails
      return { success: false, error: error.message };
    }
  }

  async sendAnnouncementEmail(
    recipientEmail: string,
    recipientName: string,
    announcementData: {
      announcementTitle: string;
      announcementMessage: string;
      eventTitle: string;
      eventDate: Date;
    },
  ) {
    try {
      // Format date
      const eventDateFormatted = new Date(announcementData.eventDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Email HTML template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Event Announcement</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #249E94 0%, #1f8b82 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 30px;
            }
            .announcement-box {
              background: #f8f9fa;
              border-left: 4px solid #249E94;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .announcement-title {
              font-size: 20px;
              font-weight: 700;
              color: #249E94;
              margin: 0 0 10px 0;
            }
            .announcement-message {
              color: #555;
              line-height: 1.8;
              white-space: pre-wrap;
            }
            .event-info {
              background: #e8f5f4;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .event-info h3 {
              margin: 0 0 10px 0;
              color: #249E94;
              font-size: 16px;
            }
            .event-detail {
              margin: 5px 0;
              color: #555;
            }
            .greeting {
              font-size: 16px;
              color: #555;
              margin-bottom: 15px;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              color: #777;
              font-size: 14px;
            }
            .footer p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📢 New Event Announcement</h1>
            </div>
            
            <div class="content">
              <p class="greeting">Hi ${recipientName},</p>
              
              <p>We have an important announcement regarding your registered event:</p>
              
              <div class="event-info">
                <h3>📅 Event Information</h3>
                <div class="event-detail"><strong>Event:</strong> ${announcementData.eventTitle}</div>
                <div class="event-detail"><strong>Date:</strong> ${eventDateFormatted}</div>
              </div>

              <div class="announcement-box">
                <h2 class="announcement-title">${announcementData.announcementTitle}</h2>
                <p class="announcement-message">${announcementData.announcementMessage}</p>
              </div>

              <p>We look forward to seeing you at the event!</p>
              
              <p style="margin-top: 30px; color: #777; font-size: 14px;">
                If you have any questions, please contact the event organizer.
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Event Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      const info = await this.transporter.sendMail({
        from: `"Event Management" <${process.env.MAIL_USER || 'noreply@events.com'}>`,
        to: recipientEmail,
        subject: `📢 Announcement: ${announcementData.announcementTitle} - ${announcementData.eventTitle}`,
        html: htmlContent,
      });

      console.log('Announcement email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending announcement email:', error);
      return { success: false, error: error.message };
    }
  }
}
