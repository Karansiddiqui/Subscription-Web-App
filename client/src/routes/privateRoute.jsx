import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../context/user.context.jsx';

export default function PrivateRoute() {
  const { user, fetchUser } = useUser();

  // useEffect(() => {
  //   async function checkUser() {
  //     await fetchUser();
  //   }

  //   checkUser(); 
  // }, []);
  if (user.loading) {
    return <div>Loading...</div>; 
  }

  // outlet to access child of route, or redirect to sign-in
  return user.data ? <Outlet /> : <Navigate to='/sign-in' />;
}
