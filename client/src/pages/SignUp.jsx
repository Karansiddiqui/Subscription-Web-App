import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Alert, Label, Spinner, TextInput } from "flowbite-react";
import { Button } from "flowbite-react";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.email) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      }
      setLoading(false);

      if (res.ok) {
        navigate("/sign-in  ");
      }
    } catch (err) {
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex p-3 max-w-fit gap-8 mx-auto flex-col md:flex-row md:gap-20 pt-52">
        {/* left part */}
        <div className="flex-1 md:mt-24 max-w-lg">
          <Link to={"/"} className="font-bold dark:text-white text-4xl">
            <span className=" text-[rgb(151,151,162)]">
            Open
            </span>
            Post
          </Link>
          <p className="text-sm mt-5">
          This is a demo project. You can sign in with email <strong className=" text-green-500">user@gmail.com</strong> and password <strong className=" text-green-500">12345 </strong> 
           or with Google
          </p>
        </div>

        {/* RIGHT PART */}
        <div className="flex-1 w-full">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Username"></Label>
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Email"></Label>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password"></Label>
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
              <p className='opacity-50 text-sm'>Password must be at least 5 characters</p>
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
    
        
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className="text-blue-700">
              Sign In
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
