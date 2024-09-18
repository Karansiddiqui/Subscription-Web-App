const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/v1/subs/getSubscription", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.data && response.data.data && response.data.data.plan) {
        return response.data.data.plan;
      } else {
        return "No Plan";
      }
    } catch (error) {
      console.error("Error fetching subscription", error);
      return "Error";
    }
  };

  export default fetchSubscription;