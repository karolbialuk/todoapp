import axios from "axios";

export async function registerOrLoginUser(
  inputs: RegisterInputs | LoginInputs,
  path: string
) {
  const response = await axios.post(
    `http://localhost:8800/api/auth/${path}`,
    inputs,
    {
      withCredentials: true,
    }
  );

  return response;
}
