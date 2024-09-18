import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/user.context.jsx";
import { Dropdown } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import fetchSubscription from "../../utils/fetchSubscription.utils.js";
const NavBar = () => {
  const { user, logOut } = useUser();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const getSubscription = async () => {
      try {
        const subs = await fetchSubscription();
        setSubscription(subs?.nickname || "No Plan");
      } catch (error) {
        console.error("Error fetching subscription", error);
        setSubscription("Error");
      }
    };

    if (user?.data) {
      getSubscription();
    }
  }, [user]);


  const handleSignout = async () => {
    try {
      const res = await fetch("/api/v1/users/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        logOut();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-between h-16 bg-gray-100 items-center px-8 bg-transparent">
      {user?.data ? (
        <Link to="/articles" className="text-black text-xl hover:text-blue-700">
          Home
        </Link>
      ) : (
        <Link to="/" className="text-black text-xl hover:text-blue-700">
          Home
        </Link>
      )}

      {user?.data ? (
        <div className="flex items-center space-x-4">
          <Dropdown label={"Current Plan"} inline={true}>
            <Dropdown.Header>
              <span className="block text-sm text-center">
                @{user.data?.username}
              </span>
              <span className="block truncate text-sm font-medium text-center">
                {subscription}
              </span>
            </Dropdown.Header>

            <Dropdown.Item onClick={() => navigate('/articles-plans')} className="bg-blue-900 text-white hover:text-black">
              Choose another plan
            </Dropdown.Item>
          </Dropdown>
          <Link
            to="/sign-in"
            className="text-black text-xl mx-8 hover:text-blue-700"
            onClick={handleSignout}
          >
            Sign out
          </Link>
        </div>
      ) : (
        <Link to="/sign-in" className="text-black text-xl hover:text-blue-700">
          Sign in
        </Link>
      )}
    </div>
  );
};

export default NavBar;
