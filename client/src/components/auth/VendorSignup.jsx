import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaStore, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaLock, 
  FaBuilding, 
  FaIdCard, 
  FaFileInvoiceDollar, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaArrowLeft
} from 'react-icons/fa';

const VendorSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: '',
    businessDescription: '',
    businessCategory: '',
    yearEstablished: '',
    
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Account Information
    username: '',
    password: '',
    confirmPassword: '',
    
    // Legal Information
    taxId: '',
    businessLicense: null,
    identityDocument: null,
    
    // Terms and Agreements
    agreeToTerms: false,
    agreeToPrivacyPolicy: false,
    agreeToSellerAgreement: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const businessCategories = [
    'Grocery & Food',
    'Restaurant',
    'Bakery',
    'Clothing & Apparel',
    'Electronics',
    'Home & Garden',
    'Beauty & Personal Care',
    'Health & Wellness',
    'Toys & Games',
    'Books & Stationery',
    'Sports & Outdoors',
    'Jewelry & Accessories',
    'Art & Crafts',
    'Automotive',
    'Pet Supplies',
    'Other'
  ];

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Limited Liability Company (LLC)',
    'Corporation',
    'Cooperative',
    'Nonprofit Organization',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateStep = (step) => {
    let stepErrors = {};
    let isValid = true;
    
    if (step === 1) {
      // Validate Business Information
      if (!formData.businessName.trim()) {
        stepErrors.businessName = 'Business name is required';
        isValid = false;
      }
      
      if (!formData.businessType) {
        stepErrors.businessType = 'Business type is required';
        isValid = false;
      }
      
      if (!formData.businessDescription.trim()) {
        stepErrors.businessDescription = 'Business description is required';
        isValid = false;
      } else if (formData.businessDescription.length < 50) {
        stepErrors.businessDescription = 'Description should be at least 50 characters';
        isValid = false;
      }
      
      if (!formData.businessCategory) {
        stepErrors.businessCategory = 'Business category is required';
        isValid = false;
      }
      
      if (!formData.yearEstablished) {
        stepErrors.yearEstablished = 'Year established is required';
        isValid = false;
      } else if (isNaN(formData.yearEstablished) || 
                parseInt(formData.yearEstablished) < 1900 || 
                parseInt(formData.yearEstablished) > new Date().getFullYear()) {
        stepErrors.yearEstablished = 'Please enter a valid year';
        isValid = false;
      }
    } else if (step === 2) {
      // Validate Contact Information
      if (!formData.firstName.trim()) {
        stepErrors.firstName = 'First name is required';
        isValid = false;
      }
      
      if (!formData.lastName.trim()) {
        stepErrors.lastName = 'Last name is required';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        stepErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = 'Email is invalid';
        isValid = false;
      }
      
      if (!formData.phone.trim()) {
        stepErrors.phone = 'Phone number is required';
        isValid = false;
      } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
        stepErrors.phone = 'Phone number is invalid';
        isValid = false;
      }
    } else if (step === 3) {
      // Validate Address Information
      if (!formData.address.trim()) {
        stepErrors.address = 'Street address is required';
        isValid = false;
      }
      
      if (!formData.city.trim()) {
        stepErrors.city = 'City is required';
        isValid = false;
      }
      
      if (!formData.state.trim()) {
        stepErrors.state = 'State is required';
        isValid = false;
      }
      
      if (!formData.zipCode.trim()) {
        stepErrors.zipCode = 'ZIP code is required';
        isValid = false;
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        stepErrors.zipCode = 'ZIP code is invalid';
        isValid = false;
      }
      
      if (!formData.country.trim()) {
        stepErrors.country = 'Country is required';
        isValid = false;
      }
    } else if (step === 4) {
      // Validate Account Information
      if (!formData.username.trim()) {
        stepErrors.username = 'Username is required';
        isValid = false;
      } else if (formData.username.length < 5) {
        stepErrors.username = 'Username should be at least 5 characters';
        isValid = false;
      }
      
      if (!formData.password) {
        stepErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        stepErrors.password = 'Password should be at least 8 characters';
        isValid = false;
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
        stepErrors.password = 'Password should include uppercase, lowercase, number and special character';
        isValid = false;
      }
      
      if (!formData.confirmPassword) {
        stepErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    } else if (step === 5) {
      // Validate Legal Information
      if (!formData.taxId.trim()) {
        stepErrors.taxId = 'Tax ID is required';
        isValid = false;
      } else if (!/^\d{2}-\d{7}$|^\d{9}$/.test(formData.taxId.replace(/-/g, ''))) {
        stepErrors.taxId = 'Tax ID format is invalid';
        isValid = false;
      }
      
      if (!formData.businessLicense) {
        stepErrors.businessLicense = 'Business license document is required';
        isValid = false;
      }
      
      if (!formData.identityDocument) {
        stepErrors.identityDocument = 'Identity document is required';
        isValid = false;
      }
    } else if (step === 6) {
      // Validate Terms and Agreements
      if (!formData.agreeToTerms) {
        stepErrors.agreeToTerms = 'You must agree to the Terms of Service';
        isValid = false;
      }
      
      if (!formData.agreeToPrivacyPolicy) {
        stepErrors.agreeToPrivacyPolicy = 'You must agree to the Privacy Policy';
        isValid = false;
      }
      
      if (!formData.agreeToSellerAgreement) {
        stepErrors.agreeToSellerAgreement = 'You must agree to the Seller Agreement';
        isValid = false;
      }
    }
    
    setErrors(stepErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // In a real app, this would be an API call to register the vendor
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful submission
      setSubmissionSuccess(true);
      
      // In a real app, you might redirect to a success page or dashboard
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 3000);
      
    } catch (error) {
      setSubmissionError('There was an error submitting your application. Please try again later.');
      console.error('Error submitting vendor application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, name: 'Business' },
      { number: 2, name: 'Contact' },
      { number: 3, name: 'Address' },
      { number: 4, name: 'Account' },
      { number: 5, name: 'Legal' },
      { number: 6, name: 'Review' }
    ];
    
    return (
      <div className="mb-8">
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step.number 
                      ? 'bg-blue-600 text-white' 
                      : currentStep > step.number 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <FaCheckCircle />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span className={`mt-2 text-xs ${
                  currentStep === step.number 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 hidden sm:block">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-between">
                {steps.map((step) => (
                  <div key={step.number} className="w-0"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="sm:hidden">
          <p className="text-sm font-medium text-gray-500">
            Step {currentStep} of {steps.length}
          </p>
          <h3 className="mt-1 text-lg font-medium text-gray-900">
            {steps.find(step => step.number === currentStep)?.name}
          </h3>
        </div>
      </div>
    );
  };

  const renderBusinessInformation = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Information</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaStore className="text-gray-400" />
              </div>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.businessName ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Your Business Name"
              />
            </div>
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
              Business Type *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="text-gray-400" />
              </div>
              <select
                                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.businessType ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Business Type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {errors.businessType && (
              <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Business Description *
            </label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              rows="4"
              className={`block w-full px-3 py-2 border ${
                errors.businessDescription ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Describe your business, products, and services (minimum 50 characters)"
            ></textarea>
            {errors.businessDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.businessDescription}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Business Category *
              </label>
              <select
                id="businessCategory"
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.businessCategory ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Category</option>
                {businessCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.businessCategory && (
                <p className="mt-1 text-sm text-red-600">{errors.businessCategory}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="yearEstablished" className="block text-sm font-medium text-gray-700 mb-1">
                Year Established *
              </label>
              <input
                type="number"
                id="yearEstablished"
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className={`block w-full px-3 py-2 border ${
                  errors.yearEstablished ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="e.g., 2010"
              />
              {errors.yearEstablished && (
                <p className="mt-1 text-sm text-red-600">{errors.yearEstablished}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContactInformation = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="First Name"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Last Name"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="email@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="(123) 456-7890"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAddressInformation = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Address</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="123 Main St"
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="New York"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State/Province *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.state ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="NY"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP/Postal Code *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.zipCode ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="10001"
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.country ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="Other">Other</option>
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAccountInformation = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Information</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                                value={formData.username}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Choose a username (min. 5 characters)"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Create a strong password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLegalInformation = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Legal Information</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
              Tax ID / EIN *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-400" />
              </div>
              <input
                type="text"
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.taxId ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="XX-XXXXXXX or XXXXXXXXX"
              />
            </div>
            {errors.taxId && (
              <p className="mt-1 text-sm text-red-600">{errors.taxId}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              For US businesses, enter your 9-digit Employer Identification Number (EIN).
            </p>
          </div>
          
          <div>
            <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-1">
              Business License/Permit *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="businessLicense"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="businessLicense"
                      name="businessLicense"
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG up to 10MB
                </p>
                {formData.businessLicense && (
                  <p className="text-sm text-green-600">
                    File selected: {formData.businessLicense.name}
                  </p>
                )}
              </div>
            </div>
            {errors.businessLicense && (
              <p className="mt-1 text-sm text-red-600">{errors.businessLicense}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="identityDocument" className="block text-sm font-medium text-gray-700 mb-1">
              Identity Document (ID/Passport) *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FaIdCard className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="identityDocument"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="identityDocument"
                      name="identityDocument"
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG up to 10MB
                </p>
                {formData.identityDocument && (
                  <p className="text-sm text-green-600">
                    File selected: {formData.identityDocument.name}
                  </p>
                )}
              </div>
            </div>
            {errors.identityDocument && (
              <p className="mt-1 text-sm text-red-600">{errors.identityDocument}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderReviewAndSubmit = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Review and Submit</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Business Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Business Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.businessName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Business Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.businessType}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Business Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.businessDescription}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.businessCategory}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Year Established</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.yearEstablished}</dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.firstName} {formData.lastName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.phone}</dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Business Address</h3>
          <dl className="grid grid-cols-1 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Street Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.address}</dd>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.city}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">State/Province</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.state}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ZIP/Postal Code</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.zipCode}</dd>
              </div>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.country}</dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
          <dl className="grid grid-cols-1 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.username}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Password</dt>
              <dd className="mt-1 text-sm text-gray-900">••••••••</dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Legal Information</h3>
          <dl className="grid grid-cols-1 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Tax ID / EIN</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.taxId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Business License</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.businessLicense ? formData.businessLicense.name : 'Not uploaded'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Identity Document</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.identityDocument ? formData.identityDocument.name : 'Not uploaded'}
              </dd>
            </div>

          </dl>
        </div>
        
        <div className="space-y-4">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  errors.agreeToTerms ? 'border-red-300' : ''
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                Terms of Service *
              </label>
              <p className="text-gray-500">
                I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link>
              </p>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
              )}
            </div>
          </div>
          
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToPrivacyPolicy"
                name="agreeToPrivacyPolicy"
                type="checkbox"
                checked={formData.agreeToPrivacyPolicy}
                onChange={handleChange}
                className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  errors.agreeToPrivacyPolicy ? 'border-red-300' : ''
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToPrivacyPolicy" className="font-medium text-gray-700">
                Privacy Policy *
              </label>
              <p className="text-gray-500">
                I agree to the <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
              </p>
              {errors.agreeToPrivacyPolicy && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToPrivacyPolicy}</p>
              )}
            </div>
          </div>
          
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToSellerAgreement"
                name="agreeToSellerAgreement"
                type="checkbox"
                checked={formData.agreeToSellerAgreement}
                onChange={handleChange}
                className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  errors.agreeToSellerAgreement ? 'border-red-300' : ''
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToSellerAgreement" className="font-medium text-gray-700">
                Seller Agreement *
              </label>
              <p className="text-gray-500">
                I agree to the <Link to="/seller-agreement" className="text-blue-600 hover:text-blue-500">Seller Agreement</Link> and understand my responsibilities as a vendor.
              </p>
              {errors.agreeToSellerAgreement && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToSellerAgreement}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBusinessInformation();
      case 2:
        return renderContactInformation();
      case 3:
        return renderAddressInformation();
      case 4:
        return renderAccountInformation();
      case 5:
        return renderLegalInformation();
      case 6:
        return renderReviewAndSubmit();
      default:
        return null;
    }
  };

  if (submissionSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-green-100 border-b border-green-200">
            <div className="flex justify-center">
              <FaCheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-extrabold text-gray-900">
              Application Submitted!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your vendor application has been successfully submitted for review.
            </p>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Thank you for applying to become a vendor. Our team will review your application and get back to you within 2-3 business days.
            </p>
            <p className="text-gray-700 mb-6">
              You will receive a confirmation email at <span className="font-medium">{formData.email}</span> with further instructions.
            </p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Vendor Application</h1>
            <p className="mt-1 text-sm text-gray-600">
              Complete the form below to apply as a vendor on our platform.
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {renderStepIndicator()}
            
            {submissionError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{submissionError}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {renderCurrentStep()}
              
              <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                      isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have a vendor account? <Link to="/vendor/login" className="text-blue-600 hover:text-blue-500">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;

