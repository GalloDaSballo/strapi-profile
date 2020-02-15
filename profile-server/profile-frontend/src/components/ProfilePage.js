import React from 'react'
import axios from 'axios'

import {API_URL} from '../utils/urls'
import {handleChange} from '../utils/inputs'

class ProfilePage extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      bio: "The Bio",
      oneLiner: "I'll be back"
    }
    this.handleChange = handleChange.bind(this)
  }

  componentDidMount(){
    console.log("ProfilePage.componentDidMount this.props.user", this.props.user)

    const {bio, favourite_one_liner} = this.props.user.user
    this.setState({bio, oneLiner: favourite_one_liner})

  }

  handleSubmit = async (event) => {
    event.preventDefault()

    const {bio, oneLiner} = this.state

    const data = {
      bio,
      favourite_one_liner: oneLiner
    }

    const userId = this.props.user.user.id

    const updateUserRes = await axios({
      method: 'PUT',
      url: `/users/${userId}`,
      data
    })

    console.log("ProfilePage.handleSubmit updateUserRes", updateUserRes)
  }

  render(){
    const {bio, oneLiner} = this.state

    const {user} = this.props
    console.log("ProfilePage.render user", user)

    return(
      <div className="ProfilePage">
        ProfilePage
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="bio">Bio</label>
            <input type="text" name="bio" id="bio" value={bio} onChange={this.handleChange}/>
          </div>
          <div>
            <label htmlFor="oneLiner">One Liner</label>
            <input type="text" name="oneLiner" id="oneLiner" value={oneLiner} onChange={this.handleChange} />
          </div>
          <button type="submit">Update your profile</button>
        </form>
      </div>
    )
  }
}

export default ProfilePage
