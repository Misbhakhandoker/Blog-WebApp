"use client";

import { loginUser } from "@/lib/api/auth";
import { LoginSchema } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { z } from "zod";
import { useToast } from "./use-toast";

type LoginFormValues = z.infer<typeof LoginSchema>;

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged in successfully",
        variant: "default",
      });
      router.push("/");
      router.refresh();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "default",
      });
    },
  });
  const login = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return {
    login,
    isLoading: loginMutation.isLoading,
  };
}
