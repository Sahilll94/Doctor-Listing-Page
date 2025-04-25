import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Simple Loading Spinner component
function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #007BFF', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite' }} />
    </div>
  );
}

function DoctorCard({ doctor, onSpecialityClick }) {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    if (doctor) {
      setLoading(false);
    }
  }, [doctor]);

  // If loading is true, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  const {
    name,
    photo,
    specialities,
    experience,
    fees,
    languages,
    clinic,
    video_consult,
    in_clinic,
  } = doctor;

  const consultModes = [
    video_consult ? 'Video Consult' : null,
    in_clinic ? 'In Clinic' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '320px',
        border: '1px solid #e0e0e0',
        borderRadius: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      data-testid="doctor-card"
    >
      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        <img
          src={photo}
          alt={name}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #eee',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
          data-testid="doctor-photo"
        />
        <div>
          <h3
            style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#333' }}
            data-testid="doctor-name"
          >
            {name}
          </h3>
          <p
            style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#007BFF' }}
            data-testid="doctor-specialities"
          >
            {specialities.map((s, i) => (
              <span
                key={i}
                onClick={() => onSpecialityClick && onSpecialityClick(s.name)}
                style={{ cursor: 'pointer', marginRight: '6px', textDecoration: 'underline' }}
                data-testid={`speciality-${i}`}
              >
                {s.name}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#333', margin: '4px 0' }} data-testid="consult-modes">
          <strong>Mode:</strong> {consultModes || 'N/A'}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#333', margin: '4px 0' }} data-testid="doctor-experience">
          <strong>Experience:</strong> {experience}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#333', margin: '4px 0' }} data-testid="doctor-fees">
          <strong>Fee:</strong> <span style={{ color: '#f39c12' }}>{fees}</span>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#333', margin: '4px 0' }} data-testid="doctor-languages">
          <strong>Languages:</strong> {languages.join(', ')}
        </p>
        <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '8px' }} data-testid="doctor-clinic">
          🏥 {clinic?.name} – {clinic?.address?.locality}, {clinic?.address?.city}
        </p>
      </div>

      <button
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.95rem',
          alignSelf: 'flex-start',
        }}
        onClick={() => alert(`Book appointment with ${name}`)}
        data-testid="book-appointment-button"
      >
        Book Appointment
      </button>
    </div>
  );
}

DoctorCard.propTypes = {
  doctor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    specialities: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string.isRequired })
    ).isRequired,
    experience: PropTypes.string.isRequired,
    fees: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    clinic: PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.shape({
        locality: PropTypes.string,
        city: PropTypes.string,
      }),
    }),
    video_consult: PropTypes.bool,
    in_clinic: PropTypes.bool,
  }).isRequired,
  onSpecialityClick: PropTypes.func,
};

DoctorCard.defaultProps = {
  onSpecialityClick: null,
};

export default DoctorCard;
