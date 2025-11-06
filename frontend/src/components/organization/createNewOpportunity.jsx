import { useState } from 'react';
import '../../styles/organization/opportunityformOrg.css';

export default function OpportunityForm() {
  const [formData, setFormData] = useState({
    organizationName: '',
    cvRequired: false,
    opportunityTitle: '',
    numberOfVolunteers: '',
    workingHours: '',
    startDate: '',
    endDate: '',
    location: '',
    skillsRequired: '',
    benefits: '',
    description: '',
    applicationDeadline: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Opportunity form-light</h2>
          <button type="button" className="close-btn">✕</button>
        </div>

        <div className="form-body">
          {/* Organization Name & CV Required */}
          <div className="row">
            <div className="input-group flex-1">
              <label>Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="cvRequired"
                id="cvRequired"
                checked={formData.cvRequired}
                onChange={handleChange}
              />
              <label htmlFor="cvRequired">CV Required</label>
            </div>
          </div>

          {/* Opportunity Title, Number of Volunteers, Working Hours */}
          <div className="grid-3">
            <div>
              <label>Opportunity Title</label>
              <input
                type="text"
                name="opportunityTitle"
                value={formData.opportunityTitle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Number of Volunteers</label>
              <input
                type="number"
                name="numberOfVolunteers"
                value={formData.numberOfVolunteers}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Working Hours</label>
              <input
                type="text"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Start Date, End Date, Location */}
          <div className="grid-3">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Skills Required, Benefits */}
          <div className="grid-2">
            <div>
              <label>Skills Required</label>
              <textarea
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                rows="5"
              />
            </div>
            <div>
              <label>Benefits</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows="5"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
            />
          </div>

          {/* Application Deadline */}
          <div className="grid-3">
            <div>
              <label>Application Deadline</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-footer">
            <button onClick={handleSubmit}>Create New Opportunity</button>
          </div>
        </div>
      </div>
    </div>
  );
}
