import React, { useState, useEffect, useRef } from "react";
import { FaFaceGrin } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { useCalendarContext } from "../../lib/datecontext.js";
import { addTask } from "../../lib/Posts";
import { AxiosResponse } from "axios";
import EmojiPicker from "emoji-picker-react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { GetTask, editTask } from "../../lib/Posts";
import { Location } from "react-router-dom";
import { GetAllUserTasks, GetTodayTasks } from "../../lib/Posts";

export default function NewTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const taskId = location.pathname.split("/")[2];

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : "";

  const { refetchAllUserTasks } = GetAllUserTasks(userId);
  const { refetchTodayTasks } = GetTodayTasks(userId);

  const [newData, setNewData] = useState<SendInputs[]>();

  const { data, isLoading, error } = GetTask(Number(taskId), userId);

  useEffect(() => {
    if (path === "edittask") {
      setInputs((prev) => {
        return {
          taskName: (data && data[0].taskName) || "",
          taskDescription: (data && data[0].taskDescription) || "",
          taskColor: (data && data[0].taskColor) || "bg-green-300",
          repeat: (data && Boolean(data[0].taskColor)) || false,
          repeatTime: (data && data[0].repeatTime) || "",
          repeatDay: (data && data[0].repeatDay) || "",
          tasks: (data && JSON.parse(data[0].tasks)) || [],
          taskTag: (data && data[0].taskTag) || "Daily Routine",
          taskDate: calendarDate,
          userId: userId,
          emoji: (data && data[0].emoji) || "",
          done: (data && Boolean(data[0].done)) || false,
          addedUsers: (data && JSON.parse(data[0].addedUsers)) || [],
        };
      });
    }
  }, [data]);

  useEffect(() => {
    const parsedData = data?.map((item) => {
      return {
        ...item,
        tasks: JSON.parse(item.tasks),
      };
    });

    setNewData(parsedData);
  }, [data]);

  const colors = [
    "bg-green-300",
    "bg-purple-300",
    "bg-pink-200",
    "bg-blue-300",
    "bg-yellow-300",
    "bg-green-600",
    "bg-blue-400",
    "bg-indigo-700",
    "bg-pink-600",
    "bg-green-400",
    "bg-red-700",
    "bg-gray-500",
    "bg-gray-700",
    "bg-gray-800",
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const { calendarDate } = useCalendarContext();

  const categories = ["Daily Routine", "Study Routine"];

  const [showOptions, setShowOptions] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [response, setResponse] = useState<AxiosResponse>();

  const [inputs, setInputs] = useState<TaskInputs>({
    taskName: "",
    taskDescription: "",
    taskColor: "bg-green-300",
    repeat: false,
    repeatTime: "",
    repeatDay: "",
    tasks: [],
    taskTag: "Daily Routine",
    taskDate: calendarDate,
    userId: userId,
    emoji: "",
    done: false,
    addedUsers: [],
  });

  console.log(inputs);

  const [errors, setErrors] = useState<TaskErrors>({});

  const validateInputs = () => {
    const errors: TaskErrors = {};

    if (!inputs.taskName.trim()) {
      errors.taskName = "required";
    }

    if (!inputs.taskDescription.trim()) {
      errors.taskDescription = "required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (!showOptions) {
      setInputs((prev) => ({
        ...prev,
        repeatTime: "",
        repeatDay: "",
      }));
    }
  }, [showOptions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const setRepeat = (e: React.MouseEvent<HTMLLabelElement>) => {
    const checkbox = e.target as HTMLInputElement;

    setShowOptions(checkbox.checked);

    setInputs((prev) => ({ ...prev, repeat: checkbox.checked }));
  };

  const changeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const updatedInputs = {
      ...inputs,
      tasks: JSON.stringify(inputs.tasks),
      addedUsers: JSON.stringify(inputs.addedUsers),
    };

    if (validateInputs()) {
      if (path === "edittask") {
        await editTask(updatedInputs, Number(taskId), userId)
          .then((res) => {
            if (res.status === 200) {
              navigate("/");
              refetchAllUserTasks();
              refetchTodayTasks();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        await addTask(updatedInputs)
          .then((res) => {
            if (res.status === 200) {
              navigate("/");
              refetchAllUserTasks();
              refetchTodayTasks();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const addElementTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputName = formData.get("taskElementName") as string;
    const inputDescription = formData.get("taskElementDescription") as string;

    setInputs((prev) => ({
      ...prev,
      tasks: prev.tasks
        ? [
            ...prev.tasks,
            {
              singleTaskName: inputName,
              singleTaskDesc: inputDescription,
              singleTaskDone: "nie",
            },
          ]
        : [
            {
              singleTaskName: inputName,
              singleTaskDesc: inputDescription,
              singleTaskDone: "nie",
            },
          ],
    }));

    console.log(inputs);

    e.currentTarget.reset();
  };

  console.log(inputs);

  const handleRemoveItem = (itemIndexToRemove: number) => {
    console.log(itemIndexToRemove);

    setInputs((prev) => {
      const updatedTasks = prev.tasks.filter(
        (_, index) => index !== itemIndexToRemove
      );
      return {
        ...prev,
        tasks: updatedTasks,
      };
    });
  };

  return (
    <section id="newtask">
      <div className="p-8 pt-0 mx-auto">
        <div className="flex items-start space-y-5 bg:space-y-0 bg:items-center flex-col bg:flex-row space-x-4 mb-5 relative">
          <div className="flex items-center space-x-4">
            {inputs.emoji && <span className="text-3xl">{inputs?.emoji}</span>}
            <h1 className="text-4xl font-bold text-textColor">New Task</h1>
          </div>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="bg-slate-100 p-6 rounded-full flex items-center justify-center shadow-md"
          >
            <FaFaceGrin className="text-4xl absolute" />
            <GoPlus className="text-2xl p-1 bg-slate-100 rounded-full inset-x-6 -inset-y-2 relative" />
          </button>

          <div
            className="block bg:absolute left-64 -top-8"
            ref={emojiPickerRef}
          >
            <EmojiPicker
              open={showEmojiPicker}
              onEmojiClick={(e) => {
                setInputs((prev) => ({ ...prev, emoji: e.emoji }));
              }}
            />
          </div>
        </div>

        <div>
          <form className="flex flex-col space-y-3">
            <input
              className={`p-3 bg-slate-100 rounded-md ${
                errors.hasOwnProperty("taskName") ? "border border-red-700" : ""
              } shadow-md`}
              type="text"
              placeholder="Name your new task"
              value={inputs.taskName}
              name="taskName"
              onChange={changeInputs}
            />
            <input
              className={`p-3 bg-slate-100 rounded-md ${
                errors.hasOwnProperty("taskDescription")
                  ? "border border-red-700"
                  : ""
              } shadow-md`}
              type="text"
              placeholder="Describe your new task"
              value={inputs.taskDescription}
              name="taskDescription"
              onChange={changeInputs}
            />
          </form>
        </div>

        <h1 className="text-1xl font-bold mt-10 text-textColor mb-4">
          Zadania
        </h1>

        <div className="md:w-1/2 xl:w-1/3">
          <form onSubmit={addElementTask} className="flex flex-col space-y-3">
            <input
              className={`p-3 bg-slate-100 rounded-md shadow-md`}
              type="text"
              placeholder="Name element of your task"
              name="taskElementName"
            />
            <input
              className={`p-3 bg-slate-100 rounded-md shadow-md`}
              type="text"
              placeholder="Describe element of your task"
              name="taskElementDescription"
            />
            <button
              type="submit"
              className="bg-slate-100 p-2 rounded-md w-1/3 shadow-md"
            >
              Dodaj
            </button>
          </form>
        </div>

        <div className="mt-10 md:w-1/2 xl:w-1/3">
          <ul className="w-full flex flex-col space-y-3">
            {inputs.tasks.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-slate-100 p-3 rounded-md shadow-md w-full flex flex-col"
                >
                  <div className="flex items-center mb-3 space-x-3">
                    <div>
                      <h2 className="text-xl truncate">
                        {item.singleTaskName}
                      </h2>
                    </div>
                    <div>
                      <button onClick={() => handleRemoveItem(index)}>
                        <MdOutlineCancel className="text-xl text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="w-full truncate">{item.singleTaskDesc}</p>
                </div>
              );
            })}
          </ul>
        </div>

        <h1 className="text-1xl font-bold mt-10 text-textColor mb-4">
          Card color
        </h1>
        <div className="grid grid-cols-4 lg:grid-cols-6 space-x-0 justify-items-center items-center  bg:flex bg:space-x-5">
          {colors.map((item, index) => (
            <button
              onClick={(e) => {
                const button = e.target as HTMLButtonElement;
                const color = button.getAttribute("data-color") || "";
                setInputs((prev) => ({
                  ...prev,
                  taskColor: color,
                }));
              }}
              key={index}
              data-color={item}
              className={`rounded-full w-14 h-14 border-4 mb-3 bg:mb-0 ${item} ${
                inputs.taskColor === item ? "border-gray-600" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-slate-100 py-8 px-16 m-8 mt-2 rounded-md shadow-xl flex flex-col">
        <div className="flex items-center space-x-4 mb-3">
          <h2 className="font-bold text-xl text-textColor">Repeat</h2>

          <label
            onClick={setRepeat}
            className="inline-flex items-center cursor-pointer"
          >
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="relative w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
          </label>
        </div>

        <div className="flex flex-col md:flex-row space-x-10">
          <div
            className={`w-full md:w-1/2 flex flex-1 flex-col space-y-4 justify-center ${
              showOptions ? "opacity-100" : "opacity-35"
            }`}
          >
            <div className="pt-3 pb-0 bg-slate-100 text-textColor">
              Set a cycle for your task
            </div>

            <div className="h-px bg-gray-300"></div>

            <div className="flex flex-col md:flex-row justify-between md:bg-gray-200 rounded-full">
              <button
                disabled={showOptions === false}
                onClick={(e) => {
                  if (inputs.repeatTime === "daily") {
                    setInputs((prev) => ({
                      ...prev,
                      repeatTime: "",
                      repeatDay: "",
                    }));
                  } else
                    setInputs((prev) => ({
                      ...prev,
                      repeatTime: "daily",
                      repeatDay: "",
                    }));
                }}
                className={`w-1/3 flex md:justify-center py-1 rounded-full ${
                  inputs.repeatTime === "daily" ? "bg-gray-100" : ""
                }`}
              >
                Daily
              </button>
              <button
                disabled={showOptions === false}
                onClick={(e) => {
                  if (inputs.repeatTime === "weekly") {
                    setInputs((prev) => ({
                      ...prev,
                      repeatTime: "",
                      repeatDay: "",
                    }));
                  } else
                    setInputs((prev) => ({
                      ...prev,
                      repeatTime: "weekly",
                      repeatDay: "",
                    }));
                }}
                className={`w-1/3 flex md:justify-center py-1 rounded-full ${
                  inputs.repeatTime === "weekly" ? "bg-gray-100" : ""
                }`}
              >
                Weekly
              </button>
              <button
                disabled={showOptions === false}
                onClick={(e) => {
                  if (inputs.repeatTime === "monthly") {
                    setInputs((prev) => ({
                      ...prev,
                      repeatTime: "",
                      repeatDay: "",
                    }));
                  } else
                    setInputs((prev) => ({
                      ...prev,
                      repeatTime: "monthly",
                      repeatDay: "",
                    }));
                }}
                className={`w-1/3 flex md:justify-center py-1 rounded-full ${
                  inputs.repeatTime === "monthly" ? "bg-gray-100" : ""
                }`}
              >
                Monthly
              </button>
            </div>

            <div className="h-px bg-gray-300"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 bg:flex justify-between items-center py-1 space-x-0 bg:space-x-5">
              {days.map((item, index) => {
                return (
                  <button
                    disabled={showOptions === false}
                    onClick={(e) => {
                      const target = e.target as HTMLDivElement;
                      const day = target.getAttribute("data-day") || "";

                      if (inputs.repeatDay === day) {
                        setInputs((prev) => ({
                          ...prev,
                          repeatDay: "",
                          repeatTime: "",
                        }));
                      } else
                        setInputs((prev) => ({
                          ...prev,
                          repeatDay: day,
                          repeatTime: "",
                        }));
                    }}
                    key={index}
                    data-day={item}
                    className={`${
                      (index === days.length - 1 ||
                        index === days.length - 2) &&
                      inputs.repeatDay !== item
                        ? inputs.repeatDay === "Sat Sun"
                          ? "bg-gray-400"
                          : "bg-gray-200"
                        : inputs.repeatDay === item
                        ? "bg-gray-300"
                        : "bg-gray-100"
                    }  rounded-full w-10 h-10 flex mb-2 bg:mb-0 justify-center items-center text-sm text-textColor border p-5`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-gray-300"></div>

            <div className="flex justify-between items-center space-x-5 md:space-x-0 text-textColor">
              <div>Repeat</div>
              <button
                disabled={showOptions === false}
                onClick={(e) => {
                  if (inputs.repeatDay === "Sat Sun") {
                    setInputs((prev) => ({ ...prev, repeatDay: "" }));
                  } else
                    setInputs((prev) => ({ ...prev, repeatDay: "Sat Sun" }));
                }}
                className="flex items-center justify-between space-x-3"
              >
                Every week <MdOutlineKeyboardArrowRight />
              </button>
            </div>
          </div>

          <div className=" md:w-1/2 flex flex-1 flex-col space-y-5">
            <div className="pt-3 pb-0 bg-slate-100 text-textColor">
              Set a tag for your task
            </div>

            <div className="h-px bg-gray-300"></div>

            <div className="flex flex-col md:flex-row justify-between space-y-5 md:space-y-0 md:space-x-5">
              {categories.map((item, index) => {
                return (
                  <button
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      const button = e.target as HTMLButtonElement;

                      const tag = button.getAttribute("data-tag") || "";

                      setInputs((prev) => ({
                        ...prev,
                        taskTag: tag,
                      }));
                    }}
                    key={index}
                    data-tag={item}
                    className={`md:w-1/3 p-7 bg:p-3 flex justify-center items-center border rounded-lg text-center ${
                      inputs.taskTag === item ? "bg-gray-300" : ""
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              <button
                onClick={() => setShowAddMore(!showAddMore)}
                className="md:w-1/3 p-3 flex justify-center items-center border rounded-lg text-center"
              >
                Add More +
              </button>
            </div>

            {showAddMore && (
              <div>
                <input
                  className="w-full mt-3 p-2 pl-3 rounded-md bg-slate-200 shadow-md"
                  type="text"
                  placeholder="Wpisz swój nowy tag"
                  onChange={changeInputs}
                  name="taskTag"
                />
              </div>
            )}

            {response && <p className="text-center pt-6">{response?.data}</p>}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-end p-10 mb-10 pb-0">
        <button
          onClick={submitTask}
          className="bg-slate-200 py-4 px-4 rounded-full font-bold text-3xl shadow-gray-950 shadow-lg"
        >
          <IoMdCheckmark />
        </button>
      </div>
    </section>
  );
}
