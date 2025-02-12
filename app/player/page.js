"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { FaRegPlayCircle } from "react-icons/fa";
import { FolderMinusIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

export default function Example() {
  const [user, setUser] = useState();
  const [video, setVideo] = useState(); // 默認視頻 URL
  const [select, setSelect] = useState([false, false, false]);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [leaveClass, setLeaveClass] = useState([]);
  const [leaveVideo, setLeaveVideo] = useState([]);

  async function logout() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8100}/fjbc_login_api/auth/logout`, config);
    if (response.ok) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("client_id");
      window.location.href = "/";
    } else {
      alert("登出失敗！");
    }
  }

  async function getVideo(data) {
    if (!data.leave_start_time || !data.leave_start_time) {
      alert("無填寫請假時段，請詢問櫃檯幫助！");
      return;
    }
    const start_time = new Date(`${data.course_date} ${data.leave_start_time}`).getTime() / 1000;
    const leave_end_time = new Date(`${data.course_date} ${data.leave_end_time}`).getTime() / 1000;
    console.log(start_time, leave_end_time);
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_VIDEO}/fjbc_recording_api/recording/list/?classroom_id=${data.classroom_id}&start_time=${start_time}&end_time=${leave_end_time}`,
      config
    );
    const res = await response.json();
    if (response.ok) {
      setLeaveVideo(res);
      setVideoLoading(false);
    } else {
      alert(res.detail);
    }
  }

  async function getClass() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_student/leave`, config);
    const res = await response.json();
    if (response.ok) {
      setUser(res.user);
      setLeaveClass(res.leave_class);
      for (let i = 0; i < res.leave_class.length; i++) {
        setSelect([...select, false]);
      }
      setLoading(false);
    } else {
      alert("系統錯誤，請聯繫櫃檯！");
    }
  }

  async function updateItem(id, type) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_student/leave?id=${id}&finish=${type}`, config);
  }

  useEffect(() => {
    getClass();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">資料讀取中...</span>
      </div>
    );
  }

  return (
    <>
      <div className="lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Your Company"
              src="/FJBC_Logo.png"
              className="h-12 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            {leaveClass.map((course, i) => (
              <ul
                key={i}
                role="list"
                className="flex flex-col"
              >
                <li>
                  <div
                    onClick={() => {
                      setLeaveVideo([]);
                      getVideo(course);
                      setSelect(
                        select.map((s, ii) => {
                          if (ii == i) {
                            return !select[i];
                          } else {
                            return false;
                          }
                        })
                      );
                    }}
                    className="hover:bg-blue-200 py-2 flex justify-between cursor-pointer"
                  >
                    <div className="text-lg">
                      <span>{course.course_name}</span>
                      <span className="ml-4 text-gray-400">{course.course_date}</span>
                    </div>
                    {select[i] ? <FolderMinusIcon className="w-5 h-5" /> : <FolderPlusIcon className="w-5 h-5" />}
                  </div>
                  {select[i] ? (
                    <ul
                      role="list"
                      className="space-y-2"
                    >
                      {videoLoading ? (
                        <div className="flex justify-center items-center">
                          <div className="spinner_sm"></div>
                          <span className="mx-4 text-blue-300">影片讀取中...</span>
                        </div>
                      ) : (
                        <>
                          {leaveVideo.length > 0 ? (
                            leaveVideo.map((item, index) => {
                              const start = new Date(item.start_time);
                              const end = new Date(item.end_time);

                              return (
                                <li
                                  key={index}
                                  className="hover:bg-gray-200 cursor-pointer py-2"
                                  onClick={() => {
                                    updateItem(course.pointer_id, false);
                                    setVideo(item.output_url);
                                  }}
                                >
                                  <div className="flex items-center">
                                    <FaRegPlayCircle className="w-5 h-5 mx-2" />
                                    {start.toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" })} ~{" "}
                                    {end.toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" })}
                                  </div>
                                </li>
                              );
                            })
                          ) : (
                            <span className="text-red-400 flex justify-center ">無影片</span>
                          )}
                        </>
                      )}
                    </ul>
                  ) : null}
                </li>
              </ul>
            ))}
            <li className="-mx-6 mt-auto">
              <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      className="h-12 w-12"
                    />
                  ) : (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-full w-full text-gray-300"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
                <span aria-hidden="true">{user.first_name}</span>
                <span
                  onClick={() => {
                    const check = confirm(`確定要登出嗎？`);
                    if (check) {
                      logout();
                    }
                  }}
                  className="ring-1 px-2 hover:bg-blue-200 cursor-pointer"
                >
                  登出
                </span>
              </div>
            </li>
          </nav>
        </div>
      </div>
      <main className="container mx-auto pt-40 pl-96">
        <div className="px-4 sm:px-6 lg:px-8">
          <ReactPlayer
            url={video && `${video}`} // 遠程或本地視頻 URL
            controls
            width="100%" // 設置播放器寬度
            height="100%" // 設置播放器高度
          />
        </div>
      </main>
    </>
  );
}
