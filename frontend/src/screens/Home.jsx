import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [project, setProject] = useState([]);

  const navigate =useNavigate()

  function createProject(e) {
    e.preventDefault();
    console.log(projectName);

    axios
      .post("/projects/create", {
        name: projectName,
      })
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
      })

      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => {
        setProject(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="p-4">
      <div className="project flex flex-wrap gap-3 ">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project p-4  rounded-md border border-slate-300 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 font-semibold font-serif "
        >
          New Project
          <i className="  pl-1 ri-link"></i>
        </button>

        {project.map((project) => (
          <div
            onClick= { () =>{navigate(`/project`,
              {state :{project}
            })
          }}
            key={project._id}
            className="project p-4 flex flex-col capitalize rounded-md gap-2 cursor-pointer border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 font-sans"
          >
            <h2 className="font-semibold text-lg text-gray-900">
              {project.name}
            </h2>

            <div className="flex items-center gap-1 text-gray-600">
              <i className="ri-user-3-line text-indigo-500"></i>
              <span>
                {project.users.length}{" "}
                {project.users.length === 1 ? "member" : "members"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Create New Project </h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  id="projectName"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your project name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
