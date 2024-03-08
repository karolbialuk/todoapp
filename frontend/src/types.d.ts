type RegisterInputs = {
  username: string;
  email: string;
  password: string;
};

type LoginInputs = {
  email: string;
  password: string;
};

type TaskItem = {
  singleTaskName: string;
  singleTaskDesc: string;
  singleTaskDone: string;
};

type TaskInputs = {
  id?: number;
  taskName: string;
  taskDescription: string;
  taskColor: string;
  repeat: boolean;
  repeatTime: string;
  repeatDay: string;
  taskTag: string;
  taskDate: Date;
  userId: number;
  tasks: TaskItem[];
  emoji: string;
  done: boolean;
  addedUsers: [];
};

type SendInputs = {
  id?: number;
  taskName: string;
  taskDescription: string;
  taskColor: string;
  repeat: boolean | string;
  repeatTime: string;
  repeatDay: string;
  taskTag: string;
  taskDate: Date | string;
  userId: number;
  tasks: string;
  emoji: string;
  done: boolean | string;
  addedUsers: string;
};

type UpdateInputs = {
  done: boolean;
};

type TaskErrors = {
  taskName?: string;
  taskDescription?: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};
