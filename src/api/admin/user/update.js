import axios from "axios"

<<<<<<< HEAD
const updateUser = async (token, data) => {
=======
const updateUser = async (
  token,
  data
) => {
>>>>>>> 231c31a47444066e64df1974930764289292c364
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
