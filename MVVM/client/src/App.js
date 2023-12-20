import { Routes, Route } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './styles/main/css/style.css';

import Home from './routes/Home';
import RegisterView from './routes/Register/RegisterView';
import ProfileView from './routes/UserPage/ProfileView';
import ConnectView from './routes/Connect/ConnectView';
import StrangerPageView from './routes/StrangerPage/StrangerPageView';
import ChatView from './routes/Chat/ChatView';
import LiveView from './routes/Live/LiveView';


import Loading from './general/loading';
import WaitingRoom from './general/waiting-room';

import ProtectedRoutes from './general/auth/protected-route';
import ProtectedRoutesUser from './general/auth/protected-route-user';

import { useAuth0 } from '@auth0/auth0-react';

function App() {

  const { isLoading } = useAuth0();
  
  // Loading della SDK Auth0
  if (isLoading) {
    console.log("Auth0 loading");
    return <Loading></Loading>
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/waiting" element={<ProtectedRoutes><WaitingRoom /></ProtectedRoutes>} />
        <Route path="/register" element={<ProtectedRoutes><RegisterView /></ProtectedRoutes>} />
        <Route path="/connect" element={<ProtectedRoutesUser><ConnectView /></ProtectedRoutesUser>} />
        <Route path="/strangerpage" element={<ProtectedRoutesUser><StrangerPageView /></ProtectedRoutesUser>} />
        <Route path="/chat" element={<ProtectedRoutesUser><ChatView/></ProtectedRoutesUser>} />
        <Route path="/live" element={<ProtectedRoutesUser><LiveView /></ProtectedRoutesUser>} />
        <Route path="/profile" element={<ProtectedRoutesUser><ProfileView/></ProtectedRoutesUser>} />
      </Routes>
    </div>
  );
}

export default App;
