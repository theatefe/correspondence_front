import axios from "axios";

const Login = async (data) => {
  try {
    const result = await axios.post(
    `${process.env.REACT_APP_HOST}admins`,
      data,
    );
    return result;
  } catch (error) {
    return error.request;
  }
};

export default Login;
