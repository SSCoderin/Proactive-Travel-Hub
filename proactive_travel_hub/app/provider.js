"use client";
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const Provider = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkIsNewUser();
    }
  }, [user]);

  const checkIsNewUser = async () => {
    try {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
        {
          username: user?.fullName || "User",
          email: user?.emailAddresses[0]?.emailAddress,
        }
      );

      console.log("✅ User created:", resp.data);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("ℹ️ User already exists");
        return;
      }

      console.error("Error checking user:", error);
    }
  };

  return <>{children}</>;
};

export default Provider;
