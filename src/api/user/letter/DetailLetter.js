import axios from "axios";

const DetailLetter = async (token, id) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const result = await axios.get(
    `${process.env.REACT_APP_HOST}user/letter/${id}`,
    config,
    );
    return result;
  } catch (error) {
    return error.request;
  }
};

export default DetailLetter;
