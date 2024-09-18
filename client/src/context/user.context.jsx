import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    data: null,
    loading: true,
    error: null,
  });


  const token = localStorage.getItem('token');

  

  async function fetchUser() {
    try {
      const res = await fetch("/api/v1/users/me");
      
      if (res.ok) {
        const response = await res.json();
        if (response.data.user) {
          
          setUser({
            data: {
              id: response.data.user._id,
              email: response.data.user.email,
              username: response.data.user.username,
              customerStripeId: response.data.user.customerStripeId
            },
            loading: false,
            error: null,
          });
        } else {
          console.log("error ");
          
          setUser({
            data: null,
            loading: false,
            error: 'No user data found',
          });
        }
      } else {
        setUser({
          data: null,
          loading: false,
          error: 'Failed to fetch user data',
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser({
        data: null,
        loading: false,
        error: 'Failed to fetch user data due to a network error',
      });
    }
}


useEffect(() => {
  
  if (token) {
    fetchUser();
  } else {
    setUser({
      data: null,
      loading: false,
      error: null,
    });
  }
}, []);
 

  function logOut() {
    setUser({
      data: null,
      loading: false,
      error: null,
    });
    localStorage.removeItem('token');
  }

  console.log("context " + user);
  

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, logOut }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
