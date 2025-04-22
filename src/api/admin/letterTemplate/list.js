import axios from "axios"

const listPatternNumber = async (
  token,
) => {
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_HOST}admins/letterNumberingPattern`,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default listPatternNumber
