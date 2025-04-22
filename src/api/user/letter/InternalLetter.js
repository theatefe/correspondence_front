import axios from "axios";

const InternalLetter = async (token) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const result = await axios.get(
    `${process.env.REACT_APP_HOST}user/letter/catable/internal`,
    config,
    );
    return result;
  } catch (error) {
    return error.request;
  }
};

export default InternalLetter;
