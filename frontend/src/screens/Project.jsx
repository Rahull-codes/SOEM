import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";
import { initializeSocket, receieveMessage, sendMessage } from "../config/socket";

const Project = ({ navigate }) => {
  const location = useLocation();
  const [isSidePanelopen, setIsSidePanelopen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [project, setProject] = useState(location.state.project)
  const [message, setMessage] = useState('')
  const { user } = useContext(UserContext)
  const messageBox = React.createRef()

  const [users, setUsers] = useState([])

  const handleUserSelect = (id) => {
    setSelectedUserId(prevSelectedUserId => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  }

  function addCollaborators() {

    axios.put("/projects/add-user", {
      projectId: location.state.project._id,
      users: Array.from(selectedUserId)
    }).then(res => {

      console.log(res)
      setIsModalOpen(false);

    }).catch(err => {

      console.log(err)

    })
  }

  const send = () => {

    // console.log(user)

    sendMessage('project-message', {
      message,
      sender: user
    })

    appendOutgoingMessage(message);

    setMessage('')
  }

  useEffect(() => {

    initializeSocket(project._id);

    receieveMessage('project-message', data => {
      console.log(data)
      appendIncomingMessage(data)
    })

    axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {

      // console.log(res.data.project)
      setProject(res.data.project)
    })


    axios.get('/users/all').then(res => {
      setUsers(res.data.users)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  function appendIncomingMessage(messageObject) {

    // console.log(messageObject)

    const messageBox = document.querySelector('.message-box');

    const message = document.createElement('div');
    message.classList.add('message', 'max-w-72', 'flex', 'flex-col', 'p-2', 'bg-slate-50', 'w-fit', 'rounded-md', 'gap-0.5');
    message.innerHTML = `
      <small class="opacity-65 text-xs">${messageObject.sender.email || 'Unknown'}</small>
      <p class="text-sm capitalize">${messageObject.message}</p>
    `;
    messageBox.appendChild(message);
    scrollToBottom();

  }

  function appendOutgoingMessage(message) {

    // console.log(messageObject);

    const messageBox = document.querySelector('.message-box');

    const newmessage = document.createElement('div');
    newmessage.classList.add('ml-auto', 'message', 'max-w-72', 'flex', 'flex-col', 'p-2', 'bg-slate-50', 'w-fit', 'rounded-md', 'gap-0.5');
    newmessage.innerHTML = `
      <small class="opacity-65 text-xs">${user.email}</small>
      <p class="text-sm capitalize">${message}</p>
    `;
    messageBox.appendChild(newmessage);
    scrollToBottom();

  }

   function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

  
  return (
    <main className='h-screen w-screen flex'>
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0'>
          <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button onClick={() => setIsSidePanelopen(!isSidePanelopen)} className='p-2'>
            <i className="ri-group-fill"></i>
          </button>
        </header>
        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div
            ref={messageBox}
            className="message-box flex-grow flex flex-col gap-2 p-1 overflow-auto max-h-full bottom-12 ">

          </div>

          <div className="inputField absolute w-full mb-2 flex items-center justify-center bottom-0">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 px-4 flex-grow border border-gray-300 rounded-l-md outline-none shadow-sm hover:shadow-2xl transition-shadow duration-100"
              type="text"
              placeholder="Enter message"
            />
            <button
              onClick={send}
              className="p-2 px-6  bg-black text-white rounded-r-md  transition-colors duration-200 flex items-center justify-center shadow-sm hover:shadow-md">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel w-full h-full bg-slate-50 flex flex-col gap-2 absolute transition-all ${isSidePanelopen ? "translate-x-0" : "-translate-x-full"
            } top-0`}
        >
          <header className="flex justify-end p-2 px-3 bg-slate-200">
            <button
              className="p-2 font-extrabold"
              onClick={() => {
                setIsSidePanelopen(false);
              }}
            >
              <i className="ri-close-large-fill"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2">
            {project.users && project.users.map(users => {
              return (
                <div className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
                  <div className="aspect-square w-fit h-fit rounded-full flex items-center justify-center text-white p-5 bg-slate-600">
                    <i className="ri-user-3-fill absolute"></i>
                  </div>

                  <h1 className=" capitalize font-semibold text-lg">{users.email}</h1>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 max-w-md relative ">

            <header className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select a User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                <i className="ri-close-fill text-xl"></i>
              </button>
            </header>

            <div className="flex flex-col gap-2 max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user._id)}
                  className={`cursor-pointer p-2 flex items-center ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} gap-2 hover:bg-gray-100 rounded-md`}
                >
                  <div className="aspect-square w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <i className="ri-user-3-fill text-lg"></i>
                  </div>
                  <span className="capitalize text-sm font-medium">{user.email}</span>
                </div>
              ))}
            </div>

            <div className="p-2 flex border-t items-center justify-center ">
              <button
                className="w-52 mt-3 bg-blue-500 text-white px-4 py-2 mb-0 rounded-md hover:bg-blue-600 transition-colors"
                onClick={addCollaborators}
              >
                Add Collaborators
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
};

export default Project;