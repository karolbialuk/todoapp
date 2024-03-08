import axios from "axios";

export async function findUser(query: string, taskId: number) {
  const response = await axios.get(
    `http://localhost:8800/api/users?query=${query}&taskId=${taskId}`,
    {
      withCredentials: true,
    }
  );

  return response;
}
