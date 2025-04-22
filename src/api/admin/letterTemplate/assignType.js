import axios from "axios"

const assignTypeToTemplate = async (token, id, type) => {
  const data = {
    id,
    type,
  }
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_HOST}admins/letterNumberingPattern/assignNumbering`,
      data,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default assignTypeToTemplate
