import axios from "axios"

const numberingLetter = async (
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
      `${process.env.REACT_APP_HOST}user/letter/numbering`,
      data,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default numberingLetter
