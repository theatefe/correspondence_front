import axios from "axios"

const changeActiveUser = async (
  token,
  id
) => {
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_HOST}admins/user`,
      data,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default changeActiveUser
