import axios from "axios";

const DraftLetter = async (token) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const result = await axios.get(
    `${process.env.REACT_APP_HOST}user/letter/cartable/draft`,
    config,
    );
    return result;
  } catch (error) {
    return error.request;
  }
};

export default DraftLetter;
