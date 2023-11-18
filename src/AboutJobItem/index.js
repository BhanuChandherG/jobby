import React, {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import { useParams } from 'react-router-dom';
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const AboutJobItem = () => {
  const [jobDataDetails, setJobDataDetails] = useState([])
  const [similarJobsData, setSimilarJobsData] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const { id } = useParams();


  const getJobData = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    try {
      const jwtToken = Cookies.get('jwt_token')
      const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
      const optionsJobData = {
        headers: {Authorization: `Bearer ${jwtToken}`},
        method: 'GET',
      }

      const responseJobData = await fetch(jobDetailsApiUrl, optionsJobData)
      console.log('responseJobData')
      console.log(responseJobData)

      if (responseJobData.ok) {
        const fetchedJobData = await responseJobData.json()
        console.log('fetchedJobData')
        console.log(fetchedJobData)

        const updatedJobDetailsData = [fetchedJobData.job_details].map(
          eachItem => ({
            companyLogoUrl: eachItem.company_logo_url,
            companyWebsiteUrl: eachItem.company_website_url,
            employmentType: eachItem.employment_type,
            id: eachItem.id,
            jobDescription: eachItem.job_description,
            lifeAtCompany: {
              description: eachItem.life_at_company.description,
              imageUrl: eachItem.life_at_company.image_url,
            },
            location: eachItem.location,
            packagePerAnnum: eachItem.package_per_annum,
            rating: eachItem.rating,
            skills: eachItem.skills.map(eachSkill => ({
              imageUrl: eachSkill.image_url,
              name: eachSkill.name,
            })),
            title: eachItem.title,
          }),
        )

        const updatedSimilarJobDetails = fetchedJobData.similar_jobs.map(
          eachItem => ({
            companyLogoUrl: eachItem.company_logo_url,
            id: eachItem.id,
            jobDescription: eachItem.job_description,
            employmentType: eachItem.employment_type,
            location: eachItem.location,
            rating: eachItem.rating,
            title: eachItem.title,
          }),
        )

        setJobDataDetails(updatedJobDetailsData)
        setSimilarJobsData(updatedSimilarJobDetails)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      console.log(error)
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getJobData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]) // Empty dependency array to run the effect only once on mount

  const renderJobDetailsSuccessView = () => (
    <>
      <div className="job-item-container">
        <div className="first-part-container">
          <div className="img-title-container">
            <img
              className="company-logo"
              src={jobDataDetails[0].companyLogoUrl}
              alt="job details company logo"
            />
            <div className="title-rating-container">
              <h1 className="title-heading">{jobDataDetails[0].title}</h1>
              <div className="star-rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating-text">{jobDataDetails[0].rating}</p>
              </div>
            </div>
          </div>
          <div className="location-package-container">
            <div className="location-job-type-container">
              <div className="location-icon-location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{jobDataDetails[0].location}</p>
              </div>
              <div className="employment-type-icon-employment-type-container">
                <p className="job-type">{jobDataDetails[0].employmentType}</p>
              </div>
            </div>
            <div className="package-container">
              <p className="package">{jobDataDetails[0].packagePerAnnum}</p>
            </div>
          </div>
        </div>
        <hr className="item-hr-line" />
        <div className="second-part-container">
          <div className="description-visit-container">
            <h1 className="description-job-heading">Description</h1>
            <a
              className="visit-anchor"
              href={jobDataDetails[0].companyWebsiteUrl}
            >
              Visit <BiLinkExternal />
            </a>
          </div>
          <p className="description-para">{jobDataDetails[0].jobDescription}</p>
        </div>
        <h1>Skills</h1>
        <ul className="ul-job-details-container">
          {jobDataDetails[0].skills.map(eachItem => (
            <li className="li-job-details-container" key={eachItem.name}>
              <img
                className="skill-img"
                src={eachItem.imageUrl}
                alt={eachItem.name}
              />
              <p>{eachItem.name}</p>
            </li>
          ))}
        </ul>
        <div className="company-life-img-container">
          <div className="life-heading-para-container">
            <h1>Life at Company</h1>
            <p>{jobDataDetails[0].lifeAtCompany.description}</p>
          </div>
          <img
            src={jobDataDetails[0].lifeAtCompany.imageUrl}
            alt="life at company"
          />
        </div>
      </div>
      <h1 className="similar-jobs-heading">Similar Jobs</h1>
      <ul className="similar-jobs-ul-container">
        {similarJobsData.map(eachItem => (
          <SimilarJobs
            key={eachItem.id}
            similarJobData={eachItem}
            employmentType={jobDataDetails[0].employmentType}
          />
        ))}
      </ul>
    </>
  )

  const onRetryJobDetailsAgain = () => {
    getJobData()
  }

  const renderJobFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for.</p>
      <div className="btn-container-failure">
        <button
          className="failure-jod-details-btn"
          type="button"
          onClick={onRetryJobDetailsAgain}
        >
          retry
        </button>
      </div>
    </div>
  )

  const renderJobLoadingView = () => (
    <div className="job-details-loader" data-testid="loader">
      <h1>Loading...........</h1>
    </div>
  )

  const renderJobDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return renderJobFailureView()
      case apiStatusConstants.inProgress:
        return renderJobLoadingView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="job-details-view-container">{renderJobDetails()}</div>
    </>
  )
}

export default AboutJobItem
