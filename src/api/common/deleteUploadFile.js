import axios from "axios"

const deleteUploadFile = async (token, mediaId) => {
  const config = {
    headers: {
      jtoken: token,
    },
  }
  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_HOST}commons/${mediaId}`,
      config
    )
    return result
  } catch (error) {
    return error.request
  }
}

export default deleteUploadFile
