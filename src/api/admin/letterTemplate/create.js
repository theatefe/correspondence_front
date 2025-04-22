import axios from "axios"

const createPatternNumber = async (
  token,
  title,
  letterNumberingId,
  pattern,
  type,
) => {
  const data = {
    title,
    letterNumberingId,
    pattern,
    type,
  }
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_HOST}admins/letterNumberingPattern`,
      data,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default createPatternNumber
