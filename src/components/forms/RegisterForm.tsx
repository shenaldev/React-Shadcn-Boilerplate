import * as zod from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
//IMPORT COMPONENTS
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import InputField from "./elements/InputField";
//IMPORT UTILS
import ApiUrls from "@/lib/ApiUrls";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "../providers/AuthProvider";

const registerSchema = zod
  .object({
    full_name: zod.string().min(1, "Full name is required"),
    email: zod.string().email(),
    password: zod.string().min(8, "Password must be at least 8 characters"),
    confirm_password: zod.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirm_password;
    },
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    },
  );

type RegisterFormProps = {
  isMailVerified: boolean;
  onSubmit: (data: { email: string }) => void;
};

function RegisterForm({ isMailVerified, onSubmit }: RegisterFormProps) {
  const { isLoading, fetch } = useAxios();
  const auth = useAuth();
  const navigate = useNavigate();

  const registerForm = useForm<zod.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  function onSubmitHandler(data: zod.infer<typeof registerSchema>) {
    const userData = {
      name: data.full_name,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirm_password,
    };
    if (!isMailVerified) {
      onSubmit({ email: data.email });
      return;
    }

    fetch({
      method: "POST",
      urlPath: ApiUrls.auth.register,
      data: userData,
    }).then((res) => {
      auth.login(res?.user);
      navigate("/", { replace: true });
    });
  }

  //ON EMAIL VERIFICATION CREATE ACCOUNT
  useEffect(() => {
    if (isMailVerified) {
      registerForm.handleSubmit(onSubmitHandler)();
    }
  }, [isMailVerified]);

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onSubmitHandler)}>
        <FormField
          control={registerForm.control}
          name="full_name"
          render={({ field }) => (
            <InputField
              label="Full Name"
              placeholder="Alen Jake"
              field={field}
            />
          )}
        />
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <InputField
              type="email"
              label="Email Address"
              placeholder="example@mail.com"
              field={field}
            />
          )}
        />
        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <InputField type="password" label="Password" field={field} />
          )}
        />
        <FormField
          control={registerForm.control}
          name="confirm_password"
          render={({ field }) => (
            <InputField
              type="password"
              label="Confirm Password"
              field={field}
            />
          )}
        />
        <div className="mb-2 mt-6">
          <Button
            type="submit"
            className="w-full"
            variant="secondary"
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {!isLoading ? "Signup with Email" : "Signing up..."}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RegisterForm;
