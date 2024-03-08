import React, { ChangeEvent, useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import axios, { AxiosResponse } from "axios";
import { registerOrLoginUser } from "../../lib/Auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const path = "register";
  const [inputs, setInputs] = useState<RegisterInputs>({
    username: "",
    email: "",
    password: "",
  });

  const [response, setResponse] = useState<AxiosResponse>();

  const changeInputs = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const register = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await registerOrLoginUser(inputs, path).then((res) => {
      if (res.status === 200) {
        navigate("/informations");
      } else {
        setResponse(res);
      }
    });
  };

  return (
    <div id="register" className="flex justify-center py-32">
      <div className="bg-transparentBackgroundColor w-3/4 absolute md:w-1/2 py-36 rounded-[45px] p-6 drop-shadow-xl flex flex-col justify-evenly">
        {/* Welcome text */}

        <div className="flex items-center flex-col space-y-7">
          <h2 className="font-bold max-w-md text-2xl text-lightPink">
            Zarejestruj się
          </h2>
          <p className="text-base max-w-xs text-center text-textColor">
            Witaj! Załóż swoje konto i zacznij kontrolować plany.
          </p>

          {/* Icons container */}

          <div className="flex items-center justify-center space-x-4">
            <div>
              <FaGithub className="text-4xl" />
            </div>
            <div>
              <FaLinkedin className="text-4xl" />
            </div>
            <div>
              <FaInstagram className="text-4xl" />
            </div>
          </div>
        </div>

        {/* Input container */}
        <div className="flex flex-col justify-between mt-6">
          <form>
            <div className="flex space-y-5 flex-col justify-center items-center">
              <input
                name="username"
                className="flex-1 px-4 py-2 rounded-full focus:outline-none w-3/4 md:w-1/2 border"
                type="text"
                placeholder="Nazwa"
                onChange={changeInputs}
              />
              <input
                name="email"
                className="flex-1 px-4 py-2 rounded-full focus:outline-none w-3/4 md:w-1/2 border"
                type="text"
                placeholder="Adres email"
                onChange={changeInputs}
              />
              <input
                name="password"
                className="flex-1 px-4 py-2 rounded-full focus:outline-none w-3/4 md:w-1/2 border"
                type="password"
                placeholder="Hasło"
                onChange={changeInputs}
              />
              <button
                onClick={register}
                className="bg-fuchsia-300 rounded-full w-3/4 md:w-2/4 bg:w-1/4 px-1.5 py-2 text-textColor hover:bg-lightPink transition-all hover:text-black border"
              >
                Zarejestruj się
              </button>
              <p className="text-base max-w-xs text-center text-textColor">
                Masz już konto?{" "}
                <span className="text-lightPink cursor-pointer hover:text-fuchsia-800 transition">
                  <Link to="/login">Zaloguj się.</Link>
                </span>
              </p>
              {response && <p className="text-center">{response?.data}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
