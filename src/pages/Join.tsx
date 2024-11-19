import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import { useToast } from "@/hooks/use-toast";
import {z} from 'zod'
import { account } from "@/appwrite/appwrite";
import { AppwriteException } from "appwrite";
const loginSignupSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});
type LoginSignupType = z.infer<typeof loginSignupSchema>;
export function Join() {
    const navigate = useNavigate()
  const {toast} = useToast()
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSignupType>({
    resolver: zodResolver(loginSignupSchema),
  });
  async function onSubmit({username,password}: LoginSignupType) {
    if(isLogin){
      try {
        // login here
        await account.createEmailPasswordSession(username.concat("@gmail.com"),password)
        toast({title : "Logged In"})
        navigate("/")
    
      } catch (error) {
        if(error instanceof AppwriteException)
            toast({title : error.message,variant :"destructive"})
      }
    }
    else{
      try {
        // singup
        await account.create(username,username.concat("@gmail.com"),password)
        setIsLogin(true)
        toast({title : "ACCOUNT CREATED"})
      } catch (error) {
        if(error instanceof AppwriteException)
            toast({title : error.message,variant :"destructive"})
      }
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Welcome back! Please login to your account."
              : "Create a new account to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={isLogin ? "login" : "signup"}
            onValueChange={(value) => setIsLogin(value === "login")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="userId">Username</Label>
                    <Input {...register("username")} id="username" />
                    {errors.username && <p>{errors.username.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" {...register("password")} type="password" />
                    {errors.password && <p>{errors.password.message}</p>}
                  </div>
                  <Button type="submit" disabled = {isSubmitting}>Login</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="userId">Username</Label>
                    <Input id="userId" {...register("username")} />
                    {errors.username && <p>{errors.username.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" {...register("password")} type="password" />
                    {errors.password && <p>{errors.password.message}</p>}
                  </div>
                  <Button type="submit" disabled = {isSubmitting}>Sign Up</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}