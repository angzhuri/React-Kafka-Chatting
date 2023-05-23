import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Login, ChatView } from '../layouts';

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<ChatView />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
