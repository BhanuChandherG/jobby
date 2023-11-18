
// import React, {useState} from 'react'
// import {Navigate} from 'react-router-dom'
// import Cookies from 'js-cookie'
// import './index.css'

// const websiteLogoInForm =
//   'https://assets.ccbp.in/frontend/react-js/logo-img.png'

// const LoginForm = ({history}) => {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [showSubmitError, setShowSubmitError] = useState(false)
//   const [errorMsg, setErrorMsg] = useState('')

//   const onSubmitSuccess = jwtToken => {
//     Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
//     history.replace('/')
//   }

//   const onSubmitFailure = error => {
//     setShowSubmitError(true)
//     setErrorMsg(error)
//   }

//   const onSubmitLoginForm = async event => {
//     event.preventDefault()
//     const userDetails = {username, password}
//     const loginApiUrl = 'https://apis.ccbp.in/login'
//     const options = {
//       method: 'POST',
//       body: JSON.stringify(userDetails),
//     }

//     try {
//       const response = await fetch(loginApiUrl, options)
//       const data = await response.json()
//       if (response.ok === true) {
//         onSubmitSuccess(data.jwt_token)
//       } else {
//         onSubmitFailure(data.error_msg)
//       }
//     } catch (error) {
//       console.error('Error occurred: ', error)
//       onSubmitFailure('An error occurred while logging in')
//     }
//   }

//   const jwtToken = Cookies.get('jwt_token')
//   if (jwtToken !== undefined) {
//     return <Navigate to="/" />
//   }

//   return (
//     <div className="login-container">
//       <form className="login-form-container" onSubmit={onSubmitLoginForm}>
//         <div className="form-logo-container">
//           <img src={websiteLogoInForm} alt="website logo" />
//         </div>
//         <label className="form-label" htmlFor="username">
//           USERNAME
//         </label>
//         <br />
//         <input
//           className="form-input"
//           type="text"
//           value={username}
//           onChange={e => setUsername(e.target.value)}
//           placeholder="username"
//           id="username"
//         />
//         <br />
//         <br />
//         <label className="form-label" htmlFor="password">
//           PASSWORD
//         </label>
//         <br />
//         <input
//           className="form-input"
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           placeholder="password"
//           id="password"
//         />
//         <br />
//         <br />
//         <button className="form-submit-button" type="submit">
//           Login
//         </button>
//         {showSubmitError && <p className="error-message">*{errorMsg}</p>}
//         <p className="Hint">* Use Username-rahul & password-rahul@2021</p>
//       </form>
//     </div>
//   )
// }

// export default LoginForm


















// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react'
import Cookies from 'js-cookie'
import {Navigate} from "react-router-dom"

const Login = ({history}) => {
  const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [errMsg, setErrMsg] = useState(false)


    const SubmitEvent = jwtToken =>{
      Cookies.set("jwt_token", jwtToken, { expires: 30, path: "/" });
      history.replace('/')
    }


    const onSubmit =async event =>{
      event.preventDefault()

      const userDetails = {username, password}
      const url = 'https://apis.ccbp.in/login'
      const options = {
        method: "POST",
        body: JSON.stringify(userDetails)
      }
      try{
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)
        if(response.ok === true){
       SubmitEvent(data.jwt_token)
        }else{
          setError(data.error)
          console.log(error)
          setErrMsg(true)
        }

      }catch(error){
        console.log(error)
        setErrMsg(true)
      }
      
    }


    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Navigate to="/" />
    }



    return(
      <div>
        <form onSubmit={onSubmit}>
        <label htmlFor="username">USERNAME</label>
        <input type="text" id="username" placeholder="username" onChange={e=>setUsername(e.target.value)} />
        <label htmlFor="password">PASSWORD</label>
        <input type="password" id="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/>
        {errMsg && <p>{error}</p>}
        <button type='submit'>Login</button>
        </form>
      </div>
    )
}

export default Login
