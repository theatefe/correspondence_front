import axios from "axios"

const updateUser = async (token, data) => {
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_HOST}admins/user`,
      data,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default updateUser
