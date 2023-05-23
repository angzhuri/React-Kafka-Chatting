/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../features/store';
import { sendMessage } from '../features/chat/chat.controller';
import socketIOClient from 'socket.io-client';
import { Input, Button } from 'antd';

interface IMessageProps {
  sender: string;
  receiver: string;
  message: string;
}

const ChatView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const socket = socketIOClient('http://localhost:4000');

  const [message, setMessage] = useState<string>('');
  const [data, setData] = useState<IMessageProps[]>([]);
  const [target, setTarget] = useState<string>('');

  useEffect(() => {
    const historyMembers = JSON.parse(localStorage.getItem('members'));
    const find = historyMembers.find((f: string) => f !== searchParams.get('user'));
    setTarget(find);

    if (localStorage.getItem(searchParams.get('user'))) {
      setData(JSON.parse(localStorage.getItem(searchParams.get('user'))));
    }
  }, [message]);

  useEffect(() => {
    socket.on('message', (data) => {
      let historyData = [];
      const newData = JSON.parse(data.data);

      if (localStorage.getItem(searchParams.get('user'))) {
        historyData = JSON.parse(localStorage.getItem(searchParams.get('user')));
      }

      const saveData = {
        sender: newData.key,
        receiver: searchParams.get('user'),
        message: newData.message,
      };

      if (newData.key !== searchParams.get('user')) {
        const find = historyData.find((f: IMessageProps) => f.sender === newData.key && f.receiver === searchParams.get('user'));

        if (!find) {
          historyData.push(saveData);
        }
      }

      setData(historyData);
    });
  }, [socket]);

  const handleMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message === '') return;

    const query = [
      {
        key: searchParams.get('user'),
        value: message,
      },
    ];

    dispatch(
      sendMessage(query, () => {
        let historyMe = [];
        let historyTarget = [];

        const saveData = {
          sender: searchParams.get('user'),
          receiver: target,
          message,
        };

        if (localStorage.getItem(searchParams.get('user'))) {
          historyMe = JSON.parse(localStorage.getItem(searchParams.get('user')));
          historyTarget = JSON.parse(localStorage.getItem(target));
        }

        historyMe.push(saveData);
        historyTarget.push(saveData);

        localStorage.setItem(searchParams.get('user'), JSON.stringify(historyMe));
        localStorage.setItem(target, JSON.stringify(historyTarget));
        setMessage('');
      })
    );
  };

  const handleLogOut = () => {
    const userInfo = JSON.parse(localStorage.getItem('members'));
    const res = userInfo.filter((rs: string) => rs !== searchParams.get('user'));
    localStorage.setItem('members', JSON.stringify(res));
    localStorage.removeItem(searchParams.get('user'));
    navigate('/', { replace: true });
  };

  return (
    <div className="flex items-center justify-center w-full h-[100vh]">
      <div className="w-[400px] h-[600px] bg-[#2d343e] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-white">{searchParams.get('user')}</h2>
          <Button type="default" className="w-[17%] border-none bg-blue-500 flex items-center justify-center text-white" onClick={handleLogOut}>
            LogOut
          </Button>
        </div>
        <div className="h-[70%] overflow-y-auto flex flex-col w-full content-start">
          {data.map((rs: IMessageProps, key: number) => {
            if (rs.sender === searchParams.get('user') && rs.sender !== rs.receiver) {
              return (
                <div className="ml-0 max-w-[220px] pl-2" key={key}>
                  <p className="text-sm bg-[#250202] p-2 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] text-[#b4b6be]">{rs.message}</p>
                  <span className="text-[10px] text-[#b4b6be] pl-2">{rs.sender}</span>
                </div>
              );
            } else {
              return (
                <div className="max-w-[220px] pl-2 ml-auto mr-0 flex flex-col pr-2" key={key}>
                  <p className="text-end rounded-tl-[10px] rounded-br-[10px] rounded-bl-[10px] bg-[#ff0000] text-white p-2">{rs.message}</p>
                  <span className="text-[10px] text-[#b4b6be] pl-0 pr-2">{rs.sender}</span>
                </div>
              );
            }
          })}
        </div>
        <div className="w-full h-12 flex items-center justify-between">
          <Input
            placeholder="Enter your message"
            className="w-[80%] no-underline bg-[#404450] border-none pl-4 focus:outline-none"
            value={message}
            onChange={handleMessage}
          />
          <Button type="default" className="w-[17%] border-none bg-blue-500 text-white" onClick={handleSendMessage}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
