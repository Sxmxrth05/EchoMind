import React, { useState } from "react";

const TopNav: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Mock user data - replace with actual user data from your auth system
  const userData = {
    username: 'John Doe',
    email: 'john.doe@example.com'
  };
  const handleLogout = () => {
    // Add your logout logic here
    localStorage.clear();

    console.log("User loggedOut");

    // For example: redirect to login page, clear tokens, etc.
    // If you need to redirect, you can use: window.location.href = '/login'
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Project Name */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
              EchoMind
            </h1>
          </div>

          {/* Avatar and Logout Button */}
          <div className="flex items-center space-x-4">
            {/* Avatar with Tooltip */}
            <div className="relative flex items-center">
              <div 
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:bg-blue-600 transition-colors duration-200"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-10">
                  <div className="text-sm">
                    <div className="font-semibold mb-1">{userData.username}</div>
                    <div className="text-gray-300">{userData.email}</div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                </div>
              )}
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
