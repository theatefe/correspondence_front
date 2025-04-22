import axios from "axios"

const changeActive = async (
  token,
  id,
) => {
  const data = {
    id,
  }
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_HOST}admins/letterNumbering`,
      data,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default changeActive
