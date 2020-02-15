export function handleChange(event) {
  const {name, value} =  event.target
  this.setState({[name]: value})
}
