import React, { useState } from 'react';
import { HistoryIcon, LogOut, MessageCircle, UserCheck } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { toUpper } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/authContext';


const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuthContext();
  
  const navigate = useNavigate();

  const { data: history, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async () => 
    await api().get(`/individual/ai-model`).then((res) => {
      return res.data;
    })
  });

  const handleConversationClick = (conversationId: number) => {
    setIsDropdownOpen(false);
    navigate(`/chat?id=${conversationId}`);
  };

  return (
    <>

      <nav className="fixed top-0 w-full text-white p-4 flex justify-between items-center z-50">
        {/* Left: Logo with Dropdown */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="rounded-full flex items-center justify-center">
            <img src="/logo_white.webp" alt="logo" className='w-14 h-14' />
          </div>
          <span className="text-xl font-semibold">Insight <p className='text-gray-400 inline font-light text-sm'>- 0</p></span>
        </div>


        {/* Right: Icons */}
        <div className="flex items-center justify-center gap-4 relative">
          {isAuthenticated ? (
            <div className="">
              <Popover>
                <PopoverTrigger asChild>
                  <div 
                    className='p-2 w-10 h-10 bg-[#3a3a3a] text-white rounded-full hover:bg-gray-500 flex items-center justify-center cursor-pointer'
                  >
                    <UserCheck size={18}/>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-[#2a2a2a] rounded-lg shadow-lg p-4 z-10 border-none text-white">
                  <div className="w-64 ">
                    <h3 className="text-sm font-semibold mb-2">{toUpper(user?.first_name)} Profile</h3>
                    <div className="">
                      <Button className='flex items-center gap-2 cursor-pointer' onClick={() => logout()}>
                        logout
                        <div className="p-2 w-10">
                          <LogOut size={18} />
                        </div>
                      </Button>
                    </div> 
                  </div>
                </PopoverContent>
              </Popover>
            </div> 
          ) : (
            <button onClick={() => navigate('/login')} className="cursor-pointer">
              Login
            </button>
          )}
          <Button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="p-2 w-10 h-10 text-white rounded-full hover:bg-gray-500 flex items-center justify-center cursor-pointer"
          >
            <HistoryIcon size={18} />
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="p-2 w-10 h-10 text-white rounded-full hover:bg-gray-500 flex items-center justify-center cursor-pointer"
          >
            <MessageCircle size={18}/>
          </Button>
        
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-20 right-10 max-w-md h-[500px] overflow-scroll bg-[#2a2a2a] rounded-lg shadow-lg p-4 z-50">
            <h3 className="text-sm font-semibold mb-2">Chat History</h3>
            {isLoading && (
              <div className="w-lg flex items-center justify-center"> 
                <p>Loading...</p>
              </div>
            )}
            {history?.length === 0 ? (
              <p className="w-full text-gray-400 text-sm">No history yet.</p>
            ) : (
              <ul className="max-w-lg space-y-3">
                {history?.map((chat: { id: number, content: string, created_at: string}) => (
                  <li
                    key={chat?.id}
                    className="flex flex-col gap-1"
                  >
                    <p className='text-sm'>{chat?.created_at}</p>
                    <p 
                      onClick={() => handleConversationClick(chat?.id)}
                      className='p-2 bg-[#3a3a3a] rounded-lg cursor-pointer hover:bg-gray-500 transition-colors text-sm line-clamp-2 truncate'
                    >
                      {chat?.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;