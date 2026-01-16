import React, { useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

export default function MyTicketCard({ ticket }) {
  const eventDate = new Date(ticket.event.startDate);
  const ticketRef = useRef(null);

  const handleDownload = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: '#f9fafb',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        
        const link = document.createElement('a');
        link.download = `ticket-${ticket.referenceCode}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error downloading ticket:', error);
        alert('Failed to download ticket. Please try again.');
      }
    }
  };

  return (
    <div className="relative w-full mb-6">
      {/* Download Button - Outside ticket container */}
      <button
        onClick={handleDownload}
        style={{ position: 'absolute', top: '0.20rem', right: '0.40rem', color: '#ffffff', border: 'none', cursor: 'pointer', zIndex: 30, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, padding: '0.5rem 0.75rem', borderRadius: '0.5rem', backdropFilter: 'blur(4px)' }}
        className="hover:opacity-80 transition-opacity"
      >
        <span style={{ fontSize: '1.25rem' }}>⬇️</span>
        <span>Download</span>
      </button>

      {/* Ticket Container with perforation effect */}
      <div ref={ticketRef} style={{ background: 'linear-gradient(to bottom right, #ffffff, #f9fafb)', borderRadius: '0.75rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', border: '4px dashed #d1d5db' }}>
        
        {/* Top Section - Event Details */}
        <div style={{ position: 'relative', padding: '1.25rem', color: '#ffffff', background: 'linear-gradient(to right, #249E94, #1f8b82)' }}>
          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', width: '2rem', height: '2rem', borderTop: '2px solid rgba(255,255,255,0.3)', borderLeft: '2px solid rgba(255,255,255,0.3)', borderTopLeftRadius: '0.5rem' }}></div>
          
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-block', padding: '0.125rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎫 Event Ticket
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.25rem', filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))' }}>{ticket.event.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', marginBottom: '0.125rem' }}>
              <span>📍</span>
              <p style={{ fontWeight: 500, margin: 0 }}>{ticket.event.location}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem' }}>
              <span>📅</span>
              <p style={{ fontWeight: 500, margin: 0 }}>
                {isNaN(eventDate.getTime())
                  ? "Date not set"
                  : eventDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
              </p>
            </div>
          </div>

          {/* Perforation circles - top */}
          <div style={{ position: 'absolute', bottom: '-0.75rem', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 0.25rem' }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{ width: '1.5rem', height: '1.5rem', background: '#f3f4f6', borderRadius: '9999px' }}></div>
            ))}
          </div>
        </div>

        {/* Middle Section - QR Code and Reference */}
        <div style={{ background: '#ffffff', padding: '1.25rem', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            
            {/* QR Code Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
                <QRCode
                  value={JSON.stringify({
                    type: "EVENT_TICKET",
                    ticketId: ticket.id,
                    referenceCode: ticket.referenceCode,
                    eventId: ticket.event.id,
                  })}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '10px', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.5rem 0 0 0' }}>Scan to Check In</p>
            </div>

            {/* Ticket Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem', margin: '0 0 0.125rem 0' }}>Reference Code</p>
                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', letterSpacing: '0.05em', fontFamily: 'monospace', margin: 0 }}>{ticket.referenceCode}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', flex: 1 }}>
                  <p style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem', margin: '0 0 0.125rem 0' }}>Seat Type</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0 }}>
                    {ticket.seatType === 'vip' ? (
                      <>
                        <span style={{ fontSize: '1.125rem' }}>👑</span>
                        <span style={{ color: '#d97706' }}>VIP</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.125rem' }}>🪑</span>
                        <span style={{ color: '#249E94' }}>Standard</span>
                      </>
                    )}
                  </p>
                </div>

                <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', flex: 1 }}>
                  <p style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem', margin: '0 0 0.125rem 0' }}>Ticket ID</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', fontFamily: 'monospace', margin: 0 }}>#{ticket.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Status Badge */}
        <div style={{ position: 'relative', padding: '1rem', borderTop: '4px dashed #d1d5db', background: 'linear-gradient(to right, #f3f4f6, #e5e7eb)' }}>
          {/* Perforation circles - bottom */}
          <div style={{ position: 'absolute', top: '-0.75rem', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 0.25rem' }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{ width: '1.5rem', height: '1.5rem', background: '#ffffff', borderRadius: '9999px' }}></div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '0.5rem', height: '0.5rem', background: '#9ca3af', borderRadius: '9999px' }}></div>
              <p style={{ fontSize: '10px', color: '#4b5563', fontWeight: 500, margin: 0 }}>Valid for single entry</p>
            </div>
            
            {ticket.checkedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', color: '#ffffff', fontWeight: 700, borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(to right, #22c55e, #16a34a)' }}>
                <span style={{ fontSize: '0.875rem' }}>✓</span>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}>Checked In</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', color: '#ffffff', fontWeight: 700, borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}>
                <span style={{ fontSize: '0.875rem' }}>🎟️</span>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}>Valid</span>
              </div>
            )}
          </div>

          {/* Corner decorations */}
          <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', width: '2rem', height: '2rem', borderBottom: '2px solid #9ca3af', borderLeft: '2px solid #9ca3af', borderBottomLeftRadius: '0.5rem' }}></div>
          <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', width: '2rem', height: '2rem', borderBottom: '2px solid #9ca3af', borderRight: '2px solid #9ca3af', borderBottomRightRadius: '0.5rem' }}></div>
        </div>

      </div>
    </div>
  );
}
