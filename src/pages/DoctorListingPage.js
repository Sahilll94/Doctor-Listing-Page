import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';

function DoctorListingPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [selectedConsultationType, setSelectedConsultationType] = useState(null);
  const [sortOption, setSortOption] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // Function to filter doctors based on current filters
  const filterDoctorsList = () => {
    let filtered = [...doctors];

    if (searchText.trim()) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedSpecialities.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedSpecialities.every((selected) => 
          doc.specialities && doc.specialities.some((s) => s.name === selected.value)
        )
      );
    }

    if (selectedConsultationType) {
      filtered = filtered.filter((doc) => doc[selectedConsultationType.value]);
    }

    if (sortOption) {
      if (sortOption === 'fees_low_high') {
        filtered.sort(
          (a, b) =>
            parseInt(a.fees.replace(/[^\d]/g, '')) - parseInt(b.fees.replace(/[^\d]/g, ''))
        );
      } else if (sortOption === 'experience_high_low') {
        filtered.sort((a, b) => {
          const expA = parseInt(a.experience);
          const expB = parseInt(b.experience);
          return expB - expA;
        });
      }
    }

    console.log('Filtered Doctors:', filtered); // Log the filtered list for debugging
    setFilteredDoctors(filtered);
  };

  // Fetch doctors data from API
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_DOCTORS_API_URL;
    axios
      .get(apiUrl)
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data);  // Set initial doctor list
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setLoading(false);
      });
  }, []);

  // Set initial filter state from URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || '';
    const specialties = JSON.parse(queryParams.get('specialities') || '[]');
    const consultation = queryParams.get('consultation') || null;
    const sort = queryParams.get('sort') || '';

    setSearchText(search);
    setSelectedSpecialities(specialties);
    setSelectedConsultationType(consultation);
    setSortOption(sort);
  }, [location.search]);

  // Trigger filter function when any filter state changes
  useEffect(() => {
    filterDoctorsList();
  }, [searchText, selectedSpecialities, selectedConsultationType, sortOption, doctors]);

  const allSpecialities = Array.from(
    new Set(doctors.flatMap((d) => d.specialities.map((s) => s.name)))
  ).map((name) => ({ label: name, value: name }));

  const consultationTypes = [
    { label: 'In Clinic', value: 'in_clinic' },
    { label: 'Video Consult', value: 'video_consult' },
  ];

  const sortOptions = [
    { label: 'fees', value: 'fees_low_high' },
    { label: 'experience', value: 'experience_high_low' },
  ];

  // Handle search text change
  const handleSearchChange = (inputValue) => {
    setSearchText(inputValue);
    updateURL('search', inputValue);
  };

  // Handle speciality filter change
  const handleSpecialitiesChange = (selected) => {
    const validSelections = selected ? selected.filter((item) => item && item.value) : [];
    setSelectedSpecialities(validSelections);
    updateURL('specialities', JSON.stringify(validSelections.map((s) => s.value)));
  };

  // Handle consultation type filter change
  const handleConsultationChange = (selectedOption) => {
    setSelectedConsultationType(selectedOption);
    updateURL('consultation', selectedOption ? selectedOption.value : '');
  };

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option ? option.value : '');
    updateURL('sort', option ? option.value : '');
  };

  // Update URL with query parameter
  const updateURL = (param, value) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set(param, value);
    navigate({ search: queryParams.toString() });
  };

  const filterDoctors = (inputValue) => {
    return doctors
      .filter((doctor) =>
        doctor.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((doctor) => ({
        label: doctor.name,
        value: doctor.id,
      }));
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div style={{ padding: '2rem' }} data-testid="doctor-listing-page">
      <h1>Doctor Listing</h1>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <Select
          placeholder="Search by name..."
          value={searchText ? { label: searchText, value: searchText } : null}
          onInputChange={handleSearchChange}
          onChange={(selectedOption) => {
            if (selectedOption) {
              setSearchText(selectedOption.label);
              updateURL('search', selectedOption.label);
            } else {
              setSearchText('');
              updateURL('search', '');
            }
          }}
          options={filterDoctors(searchText)}
          isClearable
          data-testid="autocomplete-input"
          style={{ width: '300px' }}  // Increased width
        />

        <Select
          placeholder="Consultation Type"
          options={consultationTypes}
          value={selectedConsultationType}
          onChange={handleConsultationChange}
          isClearable
          data-testid="filter-consultation-type"
          style={{ width: '300px' }}  // Increased width
        />

        <Select
          placeholder="Specialties"
          options={allSpecialities}
          value={selectedSpecialities}
          onChange={handleSpecialitiesChange}
          isMulti
          isClearable
          data-testid="filter-specialties"
          style={{ width: '300px' }}  // Increased width
        />

        <Select
          placeholder="Sort By"
          options={sortOptions}
          value={sortOptions.find((opt) => opt.value === sortOption) || null}
          onChange={handleSortChange}
          isClearable
          data-testid="filter-sort"
          style={{ width: '300px' }}  // Increased width
        />
      </div>

      {/* Doctor Cards */}
      {filteredDoctors.length === 0 ? (
        <p data-testid="no-doctors-found">No doctors found.</p>
      ) : (
        filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} data-testid="doctor-card" />
        ))
      )}
    </div>
  );
}

export default DoctorListingPage;
