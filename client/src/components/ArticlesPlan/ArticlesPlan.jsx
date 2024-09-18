import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/user.context.jsx";
import fetchSubscription from "../../utils/fetchSubscription.utils.js";

export const ArticlesPlan = () => {
  const { user, logOut } = useUser();
  const [prices, setPrices] = useState([]);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    fetchPrices();
  }, []);

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

  async function fetchPrices() {
    try {
      const response = await fetch("/api/v1/subs/prices");
      const { data } = await response.json();
      setPrices(data.data);
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    }
  }

  const createSession = async (priceId) => {
    try {
      const response = await fetch("/api/v1/subs/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const result = await response.json();
      setResponse(result);

      window.location.href = result.data.data.url;
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-36 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3">
        {prices.map((price) => (
          <Card key={price.id} className="w-full flex flex-col">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              {price.nickname}
            </h5>
            <div className="flex items-baseline text-gray-900 dark:text-white mb-8">
              <span className="text-xl font-semibold">INR</span>
              <span className="text-5xl font-extrabold tracking-tight">
                {price.unit_amount / 100}
              </span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                /month
              </span>
            </div>
            <button
              type="button"
              onClick={() => createSession(price.id)}
              className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
            >
              {subscription == "Basic" &&
                (price.nickname == "Premium" && subscription == "Basic"
                  ? "Upgrade"
                  : price.nickname == "Standard" && subscription == "Basic"
                  ? "Upgrade"
                  : price.nickname == "Basic" &&
                    subscription == "Basic" &&
                    "Subscribed")}
              {subscription == "Standard" &&
                (price.nickname == "Premium" && subscription == "Standard"
                  ? "Upgrade"
                  : price.nickname == "Standard" && subscription == "Standard"
                  ? "Subscribed"
                  : price.nickname == "Basic" &&
                    subscription == "Standard" &&
                    "DownGrade")}
              {subscription == "Premium" &&
                (price.nickname == "Premium" && subscription == "Premium"
                  ? "Subscribed"
                  : price.nickname == "Standard" && subscription == "Premium"
                  ? "DownGrade"
                  : price.nickname == "Basic" &&
                    subscription == "Premium" &&
                    "DownGrade")}

              {subscription == "No Plan" && "Choose Plan"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPlan;
