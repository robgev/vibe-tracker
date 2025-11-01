"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type AuthResponse = {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
  };
};

export async function handleAuth(
  endpoint: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `${endpoint} failed`,
      };
    }

    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error(`${endpoint} error:`, error);
    return {
      success: false,
      message: `An error occurred during ${endpoint}`,
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/signin");
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  return token?.value;
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
}
