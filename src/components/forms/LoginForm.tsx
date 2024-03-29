import * as zod from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
//IMPORT COMPONENTS
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import InputField from "./elements/InputField";
import ServerErrorAlert from "../elements/ServerErrorAlert";
//IMPORT HOOKS LIBS
import useAxios from "@/hooks/useAxios";
import ApiUrls from "@/lib/ApiUrls";
import { useAuth } from "../providers/AuthProvider";

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(1, "Password is required"),
});

function LoginForm() {
  const { isLoading, statusCode, error, fetch } = useAxios();
  const auth = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<zod.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmitHandler(data: zod.infer<typeof loginSchema>) {
    fetch({ method: "POST", urlPath: ApiUrls.auth.login, data: data }).then(
      (res) => {
        if (res?.user != null) {
          auth.login(res?.user);
          navigate("/");
        }
      },
    );
  }

  return (
    <>
      {statusCode != null && <ServerErrorAlert errors={error} />}
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmitHandler)}>
          <FormField
            control={loginForm.control}
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
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <InputField type="password" label="Password" field={field} />
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
              {isLoading ? "Authenticating..." : "Login with Email"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default LoginForm;
