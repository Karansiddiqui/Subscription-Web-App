import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/v1/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await response.json();
      setArticles(data.articles);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch articles");
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-500">Loading...</p>;
  }


  return (
    <div className="max-w-screen-xl mx-auto mt-10 px-4">
      {articles.length === 0 ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Articles Available</h2>
          <p className="text-gray-500 mb-4">It looks like you do not have an active plan.</p>
          <button
            onClick={() => navigate("/articles-plans")}
            className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
          >
            Choose a Plan
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Available Articles</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {articles.map((article) => (
              <Card key={article._id} className="w-full">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="mb-4 rounded-lg"
                />
                <h5 className="mb-4 text-xl font-medium text-gray-700">
                  {article.title}
                </h5>
                <p className="text-gray-600 text-sm mb-4">{article.content.slice(0, 100)}...</p>
                <span className="mt-2 inline-block text-sm text-cyan-600">
                  {article.access} Access
                </span>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Articles;
