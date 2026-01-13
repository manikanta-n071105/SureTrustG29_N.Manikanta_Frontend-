import React from 'react'
import Chatwindow from './Chatwindow'


const Chatpopup = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isLoginPage = location.pathname === "/login";
  const profilePic = localStorage.getItem("profilePic")||"";
  return (<>
  {!isLoginPage &&
    <div>
    <div className="fixed bottom-4 right-4 z-50">
 
    {!isOpen && (<>
    <div className="flex items-center bg-green-500 px-3 py-2 rounded-full shadow-lg cusror-pointer"
    onClick={()=>setIsOpen(true)}
    >
      <div className="w-8 h-8 mr-2">
        <img
          src={profilePic}
          className="w-full h-full rounded-full"
        />
      </div>
      <span className="font-medium text-sm text-white">
        Messages
      </span>
    </div>
    </>)}
    {isOpen && (<>
    <Chatwindow onClose={() => setIsOpen(false)}/>
    </>)}
      
    </div>
    </div>}
    </>
  )
}

export default Chatpopup