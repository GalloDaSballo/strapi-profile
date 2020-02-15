import React from 'react'
import axios from 'axios'
import {handleChange} from '../utils/inputs'

class RegisterOrLogIn extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: '',
      mode: 'login'
    }

    this.handleChange = handleChange.bind(this)
  }


  handleSubmit = async (event) => {
    event.preventDefault()
    console.log("RegisterOrLogin.handleSubmit")
    //Sign the user up with strapi
    const {email, password, mode} = this.state

    const data = {
      email,
      password,
      username: email,
      identifier: email
    }

    let url = ''
    if(mode === 'login'){
      url = '/api/auth/local'
    }
    if(mode === 'signup'){
      url = '/api/auth/local/register'
    }

    const userCreationRes = await axios({
      method: 'POST',
      url,
      data
    })

    console.log("RegisterOrLogin.handleSubmit userCreationRes", userCreationRes)
    if(this.props.updateUser && typeof this.props.updateUser === 'function'){
      localStorage.setItem('user', JSON.stringify(userCreationRes.data))
      this.props.updateUser(userCreationRes.data)
    }
  }

  render(){
    const {email, password, mode} = this.state

    return(
      <div className="RegisterOrLogIn">
        <h1>{mode}</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input name="email" id="email" value={email} onChange={this.handleChange} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={password} onChange={this.handleChange} />
          </div>
          <button type="submit">{mode}</button>
        </form>
        {mode === 'login' &&
          <p onClick={() => this.setState({mode: 'signup'})}>Want to Signup instead?</p>
        }
        {mode === 'signup' &&
          <p onClick={() => this.setState({mode: 'login'})}>Want to Login instead?</p>
        }
      </div>
    )
  }
}

export default RegisterOrLogIn
