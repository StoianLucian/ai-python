import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routing/AppRoutes";

import ProfileMenu from "./components/profileMenu/ProfileMenu";
import { ChatContextProvider } from "./api/context/chatContext/ChatContext";
import DialogHost from "./components/Dialog/DialogHost";


function App() {
  return (
    <BrowserRouter>
      <ChatContextProvider>
        <ProfileMenu />
        <AppRoutes />
        <DialogHost />
      </ChatContextProvider>
    </BrowserRouter>
  )
}

export default App
