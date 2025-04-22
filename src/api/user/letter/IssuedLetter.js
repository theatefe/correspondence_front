import axios from "axios"

const IssuedLetter = async token => {
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_HOST}user/letter/catable/issued`,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default IssuedLetter
