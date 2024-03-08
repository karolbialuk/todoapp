import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCalendarContext, convDateFunc } from "../../lib/datecontext";
import { GetTasks, deleteTask, updateTask, GetTask } from "../../lib/Posts";
import { MdOutlineEdit } from "react-icons/md";
import { AiOutlineSave } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { MdFileDownloadDone } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { findUser } from "../../lib/Users";
import axios from "axios";

export default function Home() {
  const { calendarDate } = useCalendarContext();

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : "";
  const [showAddUserToTask, setShowAddUserToTask] = useState(false);
  const [foundUser, setFoundUser] = useState<User[]>();
  const [addTaskResponseStatus, setAddTaskResponseStatus] = useState("");

  const convDate = convDateFunc(calendarDate);

  const todayDate = convDateFunc(new Date());

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [userToAdd, setUserToAdd] = useState({
    userName: "",
  });

  const [newData, setNewData] = useState<SendInputs[]>();

  const { data, refetch } = GetTasks(userId, convDate);

  console.log(data);

  const setSingleTaskDone = (index: number, taskId: number) => {
    const newUpdatedTasksData = newData?.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          done: item.done === true ? false : true,
        };
      }
      return item;
    });

    const newUpdatedData = newUpdatedTasksData
      ?.map((y, i) => {
        if (i === index) {
          return {
            ...y,
          };
        }
        return undefined;
      })
      .filter((item) => item !== undefined);

    updateTask(newUpdatedData, taskId);

    setNewData(newUpdatedTasksData);
  };

  useEffect(() => {
    setNewData(data);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [calendarDate]);

  const deleteTaskFunc = async (taskId: number) => {
    const response = await deleteTask(taskId);
    if (response.status === 200) {
      refetch();
    }
  };

  const changeUserToAdd = async (
    e: React.ChangeEvent<HTMLInputElement>,
    taskId: number,
    index: number
  ) => {
    setUserToAdd((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const response = await findUser(userToAdd.userName, taskId);

    const usersToFilter = newData && JSON.parse(newData[index].addedUsers);

    const filteredUsers = response.data.filter(
      (user: { id: number }) => !usersToFilter.includes(user.id)
    );

    setFoundUser(filteredUsers);

    if (!e.target.value.length) {
      setUserToAdd((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));

      setFoundUser([]);
    }
  };

  const addUserToTask = async (id: number, userId: number, index: number) => {
    if (newData && JSON.parse(newData[index].addedUsers).includes(userId)) {
      console.log("Użytkownik został już dodany.");
    } else {
      let usersToAdd = newData && JSON.parse(newData[index].addedUsers);

      usersToAdd.push(userId);

      console.log(usersToAdd);

      const newFilteredData = newData?.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            addedUsers: JSON.stringify(usersToAdd),
          };
        }
        return item;
      });

      setNewData(newFilteredData);

      axios.put(
        "http://localhost:8800/api/tasks/singletask?taskId=" + id,
        { addedUsers: JSON.stringify(usersToAdd) },
        {
          withCredentials: true,
        }
      );

      const elementToRemove = document.getElementById(String(userId));

      elementToRemove?.remove();
    }
  };

  const showUserWindow = () => {
    setShowAddUserToTask(!showAddUserToTask);
    setAddTaskResponseStatus("");
  };

  return (
    <section
      id="home"
      className="container w-full h-full flex justify-center items-center"
    >
      <div className="flex flex-col items-center justify-between h-full w-full">
        <div className="flex h-3/4 justify-start w-full items-start flex-col">
          <h1 className="flex w-full justify-start items-start p-8 pl-6 text-4xl font-bold">
            {convDate === todayDate ? "Today" : convDate}
          </h1>

          {data?.length === 0 && (
            <div className="w-full hidden md:flex justify-center items-center">
              <object
                type="image/svg+xml"
                className="max-h-[440px]"
                data="imgs/homeimg.svg"
              >
                Twoja przeglądarka nie obsługuje osadzonych obiektów SVG.
              </object>
            </div>
          )}
          <div className="w-full flex flex-col p-6 space-y-2">
            {newData?.map((value, mainIndex) => {
              return (
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() =>
                      setExpandedIndex(
                        expandedIndex === mainIndex ? null : mainIndex
                      )
                    }
                    className={`flex items-center justify-between w-full ${value.taskColor} rounded-md px-6 py-4 space-x-4 shadow-xl`}
                  >
                    <div className="font-bold text-1xl items-center justify-center flex space-x-5">
                      <div>{value.taskName}</div>
                      <span className="text-2xl">{value.emoji}</span>
                    </div>
                    {Boolean(Number(value.done)) && (
                      <div className="p-1 rounded-full bg-slate-100">
                        <MdFileDownloadDone className="text-3xl text-green-700" />
                      </div>
                    )}
                  </button>

                  {expandedIndex === mainIndex && (
                    <div
                      id="task"
                      className={`${value.taskColor} rounded-md px-6 py-4 flex shadow-xl text-textColor`}
                    >
                      <div className="space-y-10 w-1/2">
                        <div className="my-4">
                          <div className="flex items-center space-x-10 mb-6">
                            <h2 className="text-3xl font-bold">
                              {value.taskTag}
                            </h2>

                            <div className="text-2xl text-white flex justify-stat items-center space-x-3">
                              <button className="bg-transparentBackgroundColor2 rounded-full p-1.5 shadow-md">
                                <Link to={"/edittask/" + value.id}>
                                  <MdOutlineEdit className="text-blue-700" />
                                </Link>
                              </button>
                              <button
                                onClick={() =>
                                  deleteTaskFunc(value.id as number)
                                }
                                className="bg-transparentBackgroundColor2 rounded-full p-1.5 shadow-md"
                              >
                                <MdDeleteOutline className="text-red-700" />
                              </button>
                              <button
                                onClick={showUserWindow}
                                className="bg-transparentBackgroundColor2 rounded-full p-1.5 shadow-md"
                              >
                                <IoPersonAddOutline className="text-green-700" />
                              </button>
                            </div>
                            {showAddUserToTask && (
                              <div className=" bg-transparentBackgroundColor2 p-3 rounded-md relative right-3">
                                <input
                                  name="userName"
                                  onChange={(e) =>
                                    changeUserToAdd(
                                      e,
                                      Number(value.id),
                                      mainIndex
                                    )
                                  }
                                  type="text"
                                  placeholder="Wyszukaj użytkownika"
                                  className="bg-transparent border border-slate-400  p-1 pl-2 rounded-md shadow-md"
                                />
                                {foundUser?.map((item) => {
                                  return (
                                    <div>
                                      <div
                                        id={String(item.id)}
                                        className="flex items-center justify-between mt-5"
                                      >
                                        <div className="font-bold text-xl text-neutral-800">
                                          {item.username}
                                        </div>
                                        <button
                                          onClick={() =>
                                            addUserToTask(
                                              Number(value.id),
                                              Number(item.id),
                                              mainIndex
                                            )
                                          }
                                        >
                                          <IoMdAddCircleOutline className="text-3xl text-neutral-800" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                                {addTaskResponseStatus && (
                                  <p className="text-xs text-center mt-3">
                                    {addTaskResponseStatus}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="w-full bg-transparentBackgroundColor2 p-4 rounded-md shadow-lg">
                            {value.taskDescription}
                          </p>
                        </div>
                        <div className="pb-5">
                          <h3 className="text-2xl font-bold mb-6">Zadania</h3>
                          <ul className="ml-8 list-disc space-y-4">
                            {JSON.parse(value.tasks).map(
                              (item: TaskItem, index: number) => {
                                const handleTaskDone = (
                                  e: React.MouseEvent<HTMLButtonElement>
                                ) => {
                                  const updatedTasks = JSON.parse(
                                    value.tasks
                                  ).map((t: TaskItem, i: number) => {
                                    if (i === index) {
                                      return {
                                        ...t,
                                        singleTaskDone:
                                          t.singleTaskDone === "tak"
                                            ? "nie"
                                            : "tak",
                                      };
                                    }
                                    return t;
                                  });

                                  const newUpdatedData = newData.map((t, i) => {
                                    if (mainIndex === i) {
                                      return {
                                        ...t,
                                        tasks: JSON.stringify(updatedTasks),
                                      };
                                    }
                                    return t;
                                  });

                                  console.log(newUpdatedData);

                                  const postData = newUpdatedData
                                    ?.map((y, i) => {
                                      if (i === mainIndex) {
                                        return {
                                          ...y,
                                        };
                                      }
                                      return undefined;
                                    })
                                    .filter((item) => item !== undefined);

                                  updateTask(postData, Number(value.id));

                                  setNewData(newUpdatedData);
                                };

                                return (
                                  <li
                                    key={index}
                                    className="space-y-3 text-textColor bg-transparentBackgroundColor2 rounded-md p-4 shadow-lg"
                                  >
                                    <div className="flex items-center space-x-4">
                                      <div className="text-lg font-bold">
                                        {item.singleTaskName}
                                      </div>
                                      <button onClick={handleTaskDone}>
                                        {item.singleTaskDone === "tak" ? (
                                          <MdOutlineRadioButtonChecked className="text-slate-100 text-3xl" />
                                        ) : (
                                          <MdOutlineRadioButtonUnchecked className="text-slate-100 text-3xl" />
                                        )}
                                      </button>
                                    </div>
                                    <div>{item.singleTaskDesc}</div>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                          <div className="relative mt-6">
                            <button
                              onClick={() =>
                                setSingleTaskDone(mainIndex, Number(value.id))
                              }
                              className="py-2 px-6 font-bold bg-transparentBackgroundColor2 rounded-md shadow-lg hover:bg-transparentBackgroundColor bg-red-700"
                            >
                              Zakończ
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="w-1/2 hidden md:flex justify-center items-center">
                        <object
                          type="image/svg+xml"
                          className="max-h-[440px]"
                          data="imgs/taskimg.svg"
                        >
                          Twoja przeglądarka nie obsługuje osadzonych obiektów
                          SVG.
                        </object>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex w-full items-center justify-end p-10">
          <Link to="/newtask">
            <button className="bg-slate-200 py-2 px-4 rounded-full font-bold text-3xl shadow-gray-950 shadow-lg">
              +
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
