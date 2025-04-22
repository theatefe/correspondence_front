import axios from "axios"

const create = async (
  token,
  data
) => {
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_HOST}user/letter`,
      data,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default create
