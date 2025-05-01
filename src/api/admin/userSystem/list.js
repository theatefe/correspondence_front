import axios from "axios"

<<<<<<< HEAD
const userSystemList = async token => {
=======
const userSystemList = async (
  token,
) => {
>>>>>>> 231c31a47444066e64df1974930764289292c364
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_HOST}admins/userSystem`,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default userSystemList
