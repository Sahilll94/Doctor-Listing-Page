import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 500px;
`;

const AutocompleteSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 10;
`;

const SuggestionItem = styled.div`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SuggestionImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.strong`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: block;
`;

const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const FilterRadio = styled.label`
  display: block;
  margin-bottom: 1rem;
`;

const SpecialityInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
`;

const SortSelect = styled(Select)`
  width: 100%;
  max-width: 300px;
`;

const DoctorListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const NoDoctorsMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #777;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  gap: 2rem;
  justify-content: space-between;
`;

function DoctorListingPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [specialitySearchText, setSpecialitySearchText] = useState('');
  const [selectedConsultationType, setSelectedConsultationType] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [selectedFromSuggestion, setSelectedFromSuggestion] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const filterDoctorsList = () => {
    let filtered = [...doctors];

    if (searchText.trim()) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.specialities?.some((s) => s.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (doc.clinic?.name.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (specialitySearchText.trim()) {
      filtered = filtered.filter((doc) =>
        doc.specialities?.some((s) => s.name.toLowerCase().includes(specialitySearchText.toLowerCase()))
      );
    }

    if (selectedSpecialities.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedSpecialities.every((selected) =>
          doc.specialities?.some((s) => s.name === selected)
        )
      );
    }

    if (selectedConsultationType) {
      if (selectedConsultationType.value === 'all') {
        filtered = filtered.filter((doc) => doc.in_clinic || doc.video_consult);
      } else {
        filtered = filtered.filter((doc) => doc[selectedConsultationType.value]);
      }
    }

    if (sortOption) {
      if (sortOption === 'fees_low_high') {
        filtered.sort(
          (a, b) =>
            parseInt(a.fees.replace(/[^\d]/g, '')) - parseInt(b.fees.replace(/[^\d]/g, ''))
        );
      } else if (sortOption === 'experience_high_low') {
        filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
      }
    }

    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    const apiUrl = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';
    axios
      .get(apiUrl)
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterDoctorsList();
  }, [searchText, selectedSpecialities, selectedConsultationType, sortOption, doctors, specialitySearchText]);

  useEffect(() => {
    if (searchText.trim()) {
      const suggestions = doctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
          doc.specialities?.some((s) =>
            s.name.toLowerCase().includes(searchText.toLowerCase())
          )
      );
      setAutocompleteSuggestions(suggestions.slice(0, 3));
    } else {
      setAutocompleteSuggestions([]);
      setSelectedFromSuggestion(null);
    }
  }, [searchText, doctors]);

  const allSpecialities = Array.from(
    new Set(doctors.flatMap((d) => d.specialities.map((s) => s.name)))
  );

  const consultationTypes = [
    { label: 'In Clinic', value: 'in_clinic' },
    { label: 'Video Consult', value: 'video_consult' },
    { label: 'All', value: 'all' },
  ];

  const sortOptions = [
    { label: 'Price: Low-High', value: 'fees_low_high' },
    { label: 'Experience- Most Experience first', value: 'experience_high_low' },
  ];

  const handleSpecialityCheckboxChange = (speciality) => {
    setSelectedSpecialities((prev) =>
      prev.includes(speciality)
        ? prev.filter((s) => s !== speciality)
        : [...prev, speciality]
    );
  };

  const handleSearchChange = (inputValue) => {
    setSearchText(inputValue);
    updateURL('search', inputValue);
  };

  const handleSpecialitySearchChange = (inputValue) => {
    setSpecialitySearchText(inputValue);
    updateURL('speciality', inputValue);
  };

  const handleConsultationChange = (selectedOption) => {
    setSelectedConsultationType(selectedOption);
    const queryValue =
      selectedOption.value === 'all' ? 'in_clinic+video_consult' : selectedOption.value;
    updateURL('consultation', queryValue);
  };

  const handleSortChange = (option) => {
    setSortOption(option ? option.value : '');
    updateURL('sort', option ? option.value : '');
  };

  const updateURL = (param, value) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set(param, value);
    navigate({ search: queryParams.toString() });
  };

  const handleSuggestionClick = (doctor) => {
    setSelectedFromSuggestion(doctor);
    setAutocompleteSuggestions([]);
    setFilteredDoctors([doctor]);
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <PageContainer data-testid="doctor-listing-page">
      <h1 data-testid="page-title">Doctor Listing</h1>

      <SearchContainer data-testid="search-container">
        <SearchInput
          type="text"
          placeholder="Search Doctors, Specialists, or clinics"
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          data-testid="search-input"
        />
        {autocompleteSuggestions.length > 0 && (
          <AutocompleteSuggestions data-testid="autocomplete-suggestions">
            {autocompleteSuggestions.map((doctor) => (
              <SuggestionItem
                key={doctor.id}
                onClick={() => handleSuggestionClick(doctor)}
                data-testid={`suggestion-item-${doctor.id}`}
              >
                <SuggestionImage src={doctor.photo} alt={doctor.name} data-testid="suggestion-image" />
                {doctor.name}
              </SuggestionItem>
            ))}
          </AutocompleteSuggestions>
        )}
      </SearchContainer>

      <MainContent data-testid="main-content">
        <div data-testid="filter-container">
          <FilterContainer>
            <div>
              <FilterLabel data-testid="speciality-search-label">Search Speciality</FilterLabel>
              <SpecialityInput
                type="text"
                placeholder="Search Speciality"
                value={specialitySearchText}
                onChange={(e) => handleSpecialitySearchChange(e.target.value)}
                data-testid="speciality-input"
              />
            </div>

            <FilterGroup data-testid="sort-group">
              <FilterLabel data-testid="sort-label">Sort By</FilterLabel>
              <SortSelect
                options={sortOptions}
                onChange={handleSortChange}
                value={sortOptions.find((opt) => opt.value === sortOption)}
                data-testid="sort-select"
              />
            </FilterGroup>

            <FilterGroup data-testid="consultation-type-group">
              <FilterLabel data-testid="consultation-type-label">Consultation Type</FilterLabel>
              {consultationTypes.map((type) => (
                <FilterRadio key={type.value}>
                  <input
                    type="radio"
                    value={type.value}
                    checked={selectedConsultationType?.value === type.value}
                    onChange={() => handleConsultationChange(type)}
                    data-testid={`consultation-radio-${type.value}`}
                  />
                  {type.label}
                </FilterRadio>
              ))}
            </FilterGroup>

            <FilterGroup data-testid="speciality-group">
              <FilterLabel data-testid="speciality-label">Select Speciality</FilterLabel>
              {allSpecialities.map((speciality) => (
                <FilterCheckbox key={speciality} data-testid={`speciality-checkbox-${speciality}`}>
                  <input
                    type="checkbox"
                    checked={selectedSpecialities.includes(speciality)}
                    onChange={() => handleSpecialityCheckboxChange(speciality)}
                    data-testid={`speciality-checkbox-${speciality}`}
                  />
                  {speciality}
                </FilterCheckbox>
              ))}
            </FilterGroup>
          </FilterContainer>
        </div>

        <DoctorListContainer data-testid="doctor-list-container">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
          ) : (
            <NoDoctorsMessage>No doctors match your criteria.</NoDoctorsMessage>
          )}
        </DoctorListContainer>
      </MainContent>
    </PageContainer>
  );
}

export default DoctorListingPage;
