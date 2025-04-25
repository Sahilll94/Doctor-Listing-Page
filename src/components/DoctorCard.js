import React from 'react';

function DoctorCard({ doctor }) {
  return (
    <div
      data-testid="doctor-card"
      style={{
        border: '1px solid #ddd',
        borderRadius: '15px',
        padding: '1.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        marginBottom: '1.5rem',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <img
          src={doctor.photo}
          alt={doctor.name}
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #ddd',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
        <div>
          <h3
            data-testid="doctor-name"
            style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#333',
              letterSpacing: '0.5px',
            }}
          >
            {doctor.name}
          </h3>
          <p
            data-testid="doctor-specialty"
            style={{
              margin: '0.25rem 0',
              fontSize: '0.95rem',
              color: '#666',
              fontStyle: 'italic',
            }}
          >
            {doctor.specialities.map(s => s.name).join(', ')}
          </p>
          <p
            data-testid="doctor-experience"
            style={{
              margin: '0.25rem 0',
              fontSize: '1rem',
              color: '#555',
              fontWeight: '500',
            }}
          >
            {doctor.experience}
          </p>
          <p
            data-testid="doctor-fee"
            style={{
              margin: '0.25rem 0',
              fontSize: '1rem',
              color: '#3D8D47',
              fontWeight: '600',
            }}
          >
            Fee: <span style={{ color: '#f39c12' }}>{doctor.fees}</span>
          </p>
        </div>
      </div>

      <p
        style={{
          marginTop: '1rem',
          fontSize: '0.95rem',
          color: '#444',
          lineHeight: '1.4',
          fontStyle: 'italic',
        }}
      >
        {doctor.doctor_introduction || 'No introduction available.'}
      </p>

      <p
        style={{
          fontSize: '0.85rem',
          color: '#666',
          marginTop: '1rem',
          fontStyle: 'italic',
        }}
      >
        🏥 {doctor.clinic?.name} – {doctor.clinic?.address?.locality}, {doctor.clinic?.address?.city}
      </p>
    </div>
  );
}

export default DoctorCard;
