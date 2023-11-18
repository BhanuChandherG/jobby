


import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const Navigate = useNavigate()

  const onRedirectToJobs = () => {
    Navigate('/jobs')
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <h1 className="home-heading">
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p className="home-paragraph">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <button
          className="home-jobs-button"
          type="button"
          onClick={onRedirectToJobs}
        >
          <Link className="retry-btn-link" to="/jobs">
            Find Jobs
          </Link>
        </button>
        <p className="Author">Created by BhanuChandher</p>
      </div>
    </>
  )
}

export default Home
