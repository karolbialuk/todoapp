import React from "react";
import { useNavigate } from "react-router-dom";

export default function InfoPage() {
  const navigate = useNavigate();
  return (
    <div id="information" className="flex justify-center py-12">
      <div className="bg-transparentBackgroundColor absolute w-auto h-auto bg:w-2/3 rounded-[45px] bg:p-6 drop-shadow-xl flex flex-col items-center md:flex-row justify-between">
        {/* Left side elements */}

        <div className="flex flex-col w:full bg:w-auto justify-between h-full">
          <div className="flex flex-col p-11 bg:p-0 h-3/4 justify-center">
            <h1 className="text-2xl font-bold w-auto text-center md:text-left">
              W mojej aplikacji możesz
            </h1>
            <h3 className="mt-8 mb-3 text-xl">Między innymi:</h3>
            <ul className="space-y-3">
              <li className="list-disc ml-9 text-xl">☀️ Planować taski.</li>
              <li className="list-disc ml-9 text-xl">🎯 Ustalać cele.</li>
              <li className="list-disc ml-9 text-xl">🚶️ Brać przerwy.</li>
              <li className="list-disc ml-9 text-xl">💪 Odprężyć się.</li>
              <li className="list-disc ml-9 text-xl">📝 Ustalać priotytety.</li>
              <li className="list-disc ml-9 text-xl">🔍 Kończyć zadania.</li>
              <li className="list-disc ml-9 text-xl">🚫 Pracować z innymi.</li>
              <li className="list-disc ml-9 text-xl">
                📵 Minimalizować problemy.
              </li>
              <li className="list-disc ml-9 text-xl">
                ⏰ Tworzyć burze mózgów.
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center items-center mt-10 h-1/4">
            <button
              onClick={() => navigate("/")}
              className="bg-fuchsia-300 border-gray rounded-full w-1/2 px-1.5 py-2 mb-8 text-textColor hover:bg-lightPink transition-all hover:text-black border"
            >
              Zgadzam się
            </button>
          </div>
        </div>

        {/* Right side elements */}

        <div className="hidden flex-col bg:w-2/3 h-full bg:flex">
          <object
            type="image/svg+xml"
            className="max-h-[800px]"
            data="imgs/information.svg"
            // width="400"
            // height="180"
          >
            Twoja przeglądarka nie obsługuje osadzonych obiektów SVG.
          </object>
        </div>
      </div>
    </div>
  );
}
