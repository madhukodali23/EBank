import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    submitError: false,
    errMsg: '',
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({submitError: true, errMsg})
  }

  onSubmitDetails = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {
      user_id: userId,
      pin,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const url = 'https://apis.ccbp.in/ebank/login'
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccessLogin(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {submitError, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="login-content-container">
          <div className="login-page-image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="website-login-image"
            />
          </div>
          <div className="login-text-bg-container">
            <h1 className="login-page-main-heading">Welcome Back!</h1>
            <form onSubmit={this.onSubmitDetails}>
              <label htmlFor="userId" className="labels">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                placeholder="Enter User ID"
                className="login-page-inputs"
                onChange={this.onChangeUserId}
              />
              <label htmlFor="pin" className="labels">
                PIN
              </label>
              <input
                type="password"
                placeholder="Enter PIN"
                id="pin"
                className="login-page-inputs"
                onChange={this.onChangePin}
              />
              <button type="submit" className="login-button">
                Login
              </button>
              {submitError && <p className="error-msg">{errMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
