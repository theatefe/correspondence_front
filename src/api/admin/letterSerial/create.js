import axios from "axios"

const createSerialNumber = async (
  token,
  title,
  startingNumber,
  growthNumber
) => {
  const data = {
    title,
    startingNumber,
    growthNumber,
  }
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_HOST}admins/letterNumbering`,
      data,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default createSerialNumber
