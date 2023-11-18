import React, {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

const AllJobs = () => {
  const [profileData, setProfileData] = useState([])
  const [jobsData, setJobsData] = useState([])
  const [checkboxInputs, setCheckboxInputs] = useState([])
  const [radioInput, setRadioInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [apiJobsStatus, setApiJobsStatus] = useState(
    apiJobsStatusConstants.initial,
  )

  const getProfileDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const responseProfile = await fetch(profileApiUrl, optionsProfile)

      if (responseProfile.ok) {
        const fetchedDataProfile = await responseProfile.json()
        console.log('This is Fetched Data')
        console.log(fetchedDataProfile)

        const updatedDataProfile = {
          name: fetchedDataProfile.profile_details.name,
          profileImageUrl: fetchedDataProfile.profile_details.profile_image_url,
          shortBio: fetchedDataProfile.profile_details.short_bio,
        }
        setProfileData([updatedDataProfile])
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const getJobDetails = async () => {
    setApiJobsStatus(apiJobsStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const responseJobs = await fetch(jobsApiUrl, optionsJobs)

      if (responseJobs.ok) {
        const fetchedDataJobs = await responseJobs.json()
        const updatedDataJobs = fetchedDataJobs.jobs.map(eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          title: eachItem.title,
        }))
        setJobsData(updatedDataJobs)
        setApiJobsStatus(apiJobsStatusConstants.success)
      } else {
        setApiJobsStatus(apiJobsStatusConstants.failure)
      }
    } catch (error) {
      setApiJobsStatus(apiJobsStatusConstants.failure)
    }
  }

  const handleRadioOption = event => {
    setRadioInput(event.target.id)
    getJobDetails()
  }

  const handleInputOption = event => {
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    console.log(event.target.id)

    if (inputNotInList.length === 0) {
      setCheckboxInputs(prevInputs => [...prevInputs, event.target.id])
      getJobDetails()
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      setCheckboxInputs(filteredData)
      getJobDetails()
    }
  }

  const renderProfileStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <div className="profile-container">
            <img
              src={profileData[0].profileImageUrl}
              className="profile-icon"
              alt="profile"
            />
            <h1 className="profile-name">{profileData[0].name}</h1>
            <p className="profile-description">{profileData[0].shortBio}</p>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div className="failure-button-container">
            <button
              type="button"
              className="failure-button"
              onClick={getProfileDetails}
            >
              retry
            </button>
          </div>
        )
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <h1>Loading...........</h1>     
     </div>
        )
      default:
        return null
    }
  }

  const renderJobsStatus = () => {
    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return jobsData.length === 0 ? (
          <div className="no-jobs-container">
            <img
              className="no-jobs-img"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No jobs found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        ) : (
          <ul className="ul-job-items-container">
            {jobsData.map(eachItem => (
              <JobItem key={eachItem.id} jobData={eachItem} />
            ))}
          </ul>
        )
      case apiJobsStatusConstants.failure:
        return (
          <div className="failure-img-button-container">
            <img
              className="failure-img"
              src={failureViewImg}
              alt="failure view"
            />
            <h1 className="failure-heading">Oops! Something Went Wrong</h1>
            <p className="failure-paragraph">
              We cannot seem to find the page you are looking for
            </p>
            <div className="jobs-failure-button-container">
              <button
                type="button"
                className="failure-button"
                onClick={getJobDetails}
              >
                retry
              </button>
            </div>
          </div>
        )
      case apiJobsStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <h1>Loading..........</h1>
          </div>
        )
      default:
        return null
    }
  }

  const handleSearchInput = event => {
    setSearchInput(event.target.value)
  }

  const submitSearchInput = () => {
    getJobDetails()
  }

  const handleEnterSearchInput = event => {
    if (event.key === 'Enter') {
      getJobDetails()
    }
  }

  useEffect(() => {
    getProfileDetails()
    getJobDetails()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Header />
      <div className="all-jobs-container">
        <div className="side-bar-container">
          {renderProfileStatus()}
          <hr className="hr-line" />
          <h1 className="text">Type of Employment</h1>
          <ul className="check-boxes-container">
            {employmentTypesList.map(eachItem => (
              <li className="li-container" key={eachItem.employmentTypeId}>
                <input
                  className="input"
                  id={eachItem.employmentTypeId}
                  type="checkbox"
                  onChange={handleInputOption}
                />
                <label className="label" htmlFor={eachItem.employmentTypeId}>
                  {eachItem.label}
                </label>
              </li>
            ))}
          </ul>
          <hr className="hr-line" />
          <h1 className="text">Salary Range</h1>
          <ul className="radio-button-container">
            {salaryRangesList.map(eachItem => (
              <li className="li-container" key={eachItem.salaryRangeId}>
                <input
                  className="radio"
                  id={eachItem.salaryRangeId}
                  type="radio"
                  name="option"
                  onChange={handleRadioOption}
                />
                <label className="label" htmlFor={eachItem.salaryRangeId}>
                  {eachItem.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="jobs-container">
          <div className="search-cont">
            <input
              className="search-input"
              type="search"
              value={searchInput}
              placeholder="Search"
              onChange={handleSearchInput}
              onKeyDown={handleEnterSearchInput}
            />
            <button
              data-testid="searchButton"
              type="button"
              className="search-button"
              onClick={submitSearchInput}
            >
              <AiOutlineSearch className="search-icon" />
            </button>
          </div>
          {renderJobsStatus()}
        </div>
      </div>
    </>
  )
}

export default AllJobs
