"use client";

import { useState } from "react";

export default function Example() {
  const [loginLoading, setLoginLoading] = useState(false);

  const [info, setInfo] = useState({
    username: "",
    password: ""
  });

  async function login() {
    if (info.username == "" || info.password == "") {
      alert("帳號密碼不可以為空！");
      return;
    }
    const client_id = Math.floor(Math.random() * 10000000);

    setLoginLoading(true);
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        username: info.username,
        password: info.password,
        client_id: client_id
      })
    };
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8100}/fjbc_login_api/auth/login`, config);
    const res = await response.json();
    if (response.ok) {
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("client_id", client_id);
      window.location.href = "/player";
    } else {
      if (response.status == 403) {
        alert(res.detail["zh-TW"]);
      } else {
        alert("系統錯誤！");
      }
    }
    setLoginLoading(false);
  }

  return (
    <div className="container mx-auto p-12">
      <div className="min-h-full mt-36 grid grid-cols-3">
        <div className="col-span-1 flex justify-center">
          <div className="mt-10 w-full px-12">
            <div className="flex items-center">
              <img
                alt="Your Company"
                src="/FJBC_Logo.png"
                className="h-10 w-auto"
              />
              <h2 className="text-xl font-bold text-gray-900">補課系統</h2>
            </div>
            <div>
              <div className="space-y-4">
                <div className="mt-4">
                  <label
                    htmlFor="username"
                    className="block text-lg font-medium leading-6 text-gray-900"
                  >
                    帳號
                  </label>
                  <div className="mt-2">
                    <input
                      value={info.username}
                      onChange={(event) => {
                        setInfo({
                          ...info,
                          username: event.target.value
                        });
                      }}
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-lg font-medium leading-6 text-gray-900"
                  >
                    密碼
                  </label>
                  <div className="mt-2">
                    <input
                      value={info.password}
                      onChange={(event) => {
                        setInfo({
                          ...info,
                          password: event.target.value
                        });
                      }}
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>

                <div>
                  {loginLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="spinner"></div>
                      <div>
                        <div className="mx-4 text-blue-500">登入中，請稍候...</div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={login}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      登入
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <div className="w-1/2">
            <img
              src="/doyi.png"
              className="inset-0 object-cover"
            />
          </div>
          <div className="w-1/2">
            <img
              src="/funapple2.png"
              className="inset-0 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
