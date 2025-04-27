import axios from "axios"

const userSystemList = async token => {
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
