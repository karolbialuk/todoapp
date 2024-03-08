import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { useCalendarContext, convDateFunc } from "../../lib/datecontext";
import { parseISO, format } from "date-fns";
import { GetTodayTasks, GetAllUserTasks } from "../../lib/Posts";

export default function Sidebar() {
  const { calendarDate, setCalendarDate } = useCalendarContext();

  const [dailyRoutine, setDailyRoutine] = useState<any>();
  const [studyRoutine, setStudyRoutine] = useState<any>();
  const [elseRoutine, setElseRoutine] = useState<any>();
  const [uniqueTaskTags, setUniqueTaskTags] = useState<any>();

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : "";

  const { data: todayTasks } = GetTodayTasks(userId);

  const { data: allUserTasks } = GetAllUserTasks(userId);

  useEffect(() => {
    const dailyRoutineElements = allUserTasks
      ?.map((item) => {
        if (item.taskTag === "Daily Routine") {
          return {
            item,
          };
        }
        return null;
      })
      .filter((i) => i !== null);

    setDailyRoutine(dailyRoutineElements);

    const studyRoutineElements = allUserTasks
      ?.map((item) => {
        if (item.taskTag === "Study Routine") {
          return {
            item,
          };
        }
        return null;
      })
      .filter((i) => i !== null);

    setStudyRoutine(studyRoutineElements);

    const elseRoutineElements = allUserTasks
      ?.map((item) => {
        if (
          item.taskTag !== "Daily Routine" &&
          item.taskTag !== "Study Routine"
        ) {
          return {
            ...item,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    const taskTagToCount: any = {};

    elseRoutineElements?.forEach((item: any) => {
      if (taskTagToCount[item.taskTag]) {
        taskTagToCount[item.taskTag]++;
      } else {
        taskTagToCount[item.taskTag] = 1;
      }
    });

    setUniqueTaskTags(taskTagToCount);

    console.log(uniqueTaskTags);

    setElseRoutine(elseRoutineElements);
  }, [allUserTasks]);

  useEffect(() => {
    const buttons = document.querySelectorAll("button");

    const dates = [
      "21.02.2024",
      "22.02.2024",
      "15.02.2024",
      "12.02.2024",
      "03.03.2024",
    ];

    buttons.forEach((buttonItem) => {
      const abbrElements = buttonItem.querySelectorAll("abbr");

      abbrElements.forEach((item) => {
        const abbrLabel = item.getAttribute("aria-label");

        if (abbrLabel) {
          const miesiace: Record<string, number> = {
            stycznia: 0,
            lutego: 1,
            marca: 2,
            kwietnia: 3,
            maja: 4,
            czerwca: 5,
            lipca: 6,
            sierpnia: 7,
            wrzesnia: 8,
            pazdziernika: 9,
            listopada: 10,
            grudnia: 11,
          };

          const dataString = abbrLabel;
          const [dzien, miesiacString, rok] = dataString.split(" ");

          const miesiac = miesiace[miesiacString.toLowerCase()];

          if (miesiac !== undefined) {
            const data = new Date(parseInt(rok), miesiac, parseInt(dzien));

            const dataFormatted = `${data.getDate()}.${(data.getMonth() + 1)
              .toString()
              .padStart(2, "0")}.${data.getFullYear()}`;

            if (dates.includes(dataFormatted)) {
              buttonItem.classList.add("essa");
            }
          } else {
            console.log("Nieprawidłowa nazwa miesiąca");
          }
        }
      });
    });
  }, [setCalendarDate, calendarDate]);

  return (
    <nav id="sidebar">
      <div className="container w-72 mx-auto h-screen border-r-2">
        {/* First section */}

        <div className="flex flex-col items-center pt-8 space-y-5">
          <h1 className="text-4xl font-bold">Kalendarz</h1>
          {/* Calendar*/}

          <Calendar onChange={setCalendarDate} value={calendarDate} />
        </div>

        <h2 className="ml-3 font-bold mt-7 mb-1">Tasks</h2>
        <div className="">
          <button
            onClick={() => setCalendarDate(new Date())}
            className="flex justify-between py-3 bg-slate-100 w-full"
          >
            <div className="ml-5">Dzisiaj</div>
            <div className="mr-5">{todayTasks?.length}</div>
          </button>
        </div>

        <h2 className="ml-3 font-bold mt-9 mb-1">Tasks</h2>
        <div className="">
          <div className="flex justify-between py-3">
            <div className="ml-5">Daily routine</div>
            <div className="mr-5">{dailyRoutine?.length}</div>
          </div>
          <div className="flex justify-between py-3">
            <div className="ml-5">Study routine</div>
            <div className="mr-5">{studyRoutine?.length}</div>
          </div>
          {uniqueTaskTags &&
            Object.keys(uniqueTaskTags).map((item: string) => (
              <div className="flex justify-between py-3">
                <div className="ml-5">{item}</div>
                <div className="mr-5">{uniqueTaskTags[item]}</div>
              </div>
            ))}
        </div>
      </div>
    </nav>
  );
}
