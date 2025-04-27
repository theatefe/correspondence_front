import axios from "axios"

const findUser = async (token, id) => {
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_HOST}admins/user/${id}`,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default findUser
