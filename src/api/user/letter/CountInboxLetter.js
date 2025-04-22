import axios from "axios";

const CountInboxLetter = async (token) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_HOST}user/letter/cartable/received/count`,
      config
    )
    return result;
  } catch (error) {
    return error.request;
  }
};

export default CountInboxLetter
