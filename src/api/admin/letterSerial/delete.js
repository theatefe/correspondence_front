import axios from "axios"

const deleteNumber = async (token, id) => {
  const data = { id };
  const headers = { jtoken: token };

  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_HOST}admins/letterNumbering`,
      {
        headers,
        data,
      }
    );
    return result;
  } catch (error) {
    return error.request;
  }
};

export default deleteNumber;
