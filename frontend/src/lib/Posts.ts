import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export async function addTask(inputs: SendInputs) {
  const response = await axios.post(
    "http://localhost:8800/api/tasks/add",
    inputs,
    { withCredentials: true }
  );

  return response;
}

export async function editTask(
  inputs: SendInputs,
  taskId: number,
  userId: number
) {
  const response = await axios.put(
    "http://localhost:8800/api/tasks/edit?taskId=" +
      taskId +
      "&userId=" +
      userId,
    inputs,
    { withCredentials: true }
  );

  return response;
}

export async function deleteTask(taskId: number) {
  const response = await axios.delete(
    "http://localhost:8800/api/tasks?taskId=" + taskId,
    { withCredentials: true }
  );

  return response;
}

export async function updateTask(inputs: any, taskId: number) {
  const response = await axios.put(
    "http://localhost:8800/api/tasks/update?taskId=" + taskId,
    inputs,
    { withCredentials: true }
  );

  return response;
}

export function GetTasks(userId: number, taskDate: string) {
  const { data, isLoading, error, refetch } = useQuery<SendInputs[]>({
    queryKey: ["tasks"],
    queryFn: () =>
      axios
        .get(
          "http://localhost:8800/api/tasks?userId=" +
            userId +
            "&taskDate=" +
            taskDate,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          return res.data;
        }),
  });

  return { data, isLoading, error, refetch };
}

export function GetTask(taskId: number, userId?: number) {
  const { data, isLoading, error } = useQuery<SendInputs[]>({
    queryKey: ["task"],
    queryFn: () =>
      axios
        .get(
          "http://localhost:8800/api/tasks/singlenewtask?userId=" +
            userId +
            "&taskId=" +
            taskId,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          return res.data;
        }),
  });

  return { data, isLoading, error };
}

export function GetTodayTasks(userId: number) {
  const {
    data,
    isLoading,
    error,
    refetch: refetchTodayTasks,
  } = useQuery<SendInputs[]>({
    queryKey: ["todaytasks"],
    queryFn: () =>
      axios
        .get(
          "http://localhost:8800/api/tasks/todaytasks?userId=" + userId,

          {
            withCredentials: true,
          }
        )
        .then((res) => {
          return res.data;
        }),
  });

  return { data, isLoading, error, refetchTodayTasks };
}

export function GetAllUserTasks(userId: number) {
  const {
    data,
    isLoading,
    error,
    refetch: refetchAllUserTasks,
  } = useQuery<SendInputs[]>({
    queryKey: ["alltasks"],
    queryFn: () =>
      axios
        .get(
          "http://localhost:8800/api/tasks/alltasks?userId=" + userId,

          {
            withCredentials: true,
          }
        )
        .then((res) => {
          return res.data;
        }),
  });

  return { data, isLoading, error, refetchAllUserTasks };
}
