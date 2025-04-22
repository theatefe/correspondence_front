import axios from "axios";

const InboxLetter = async (token) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const result = await axios.get(
    `${process.env.REACT_APP_HOST}user/letter/cartable/received`,
    config,
    );
    return result;
  } catch (error) {
    return error.request;
  }
};

export default InboxLetter;
