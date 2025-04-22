import axios from "axios"

const signLetter = async (token, data) => {
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_HOST}user/letter/sign`,
      data,
      config
    )
    return result
  } catch (error) {
    return error
  }
}

export default signLetter
