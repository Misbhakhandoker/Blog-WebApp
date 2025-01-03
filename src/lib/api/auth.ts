import { z } from "zod";
import { LoginSchema } from "../validations/auth";

type LoginFormValues = z.infer<typeof LoginSchema>;

export async function loginUser(credentials: LoginFormValues) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
}
