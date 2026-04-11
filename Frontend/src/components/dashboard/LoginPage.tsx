import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const loginRequest = async () => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, { email, password });
        if (response) {
            const token = response.data.token;
            console.log(token);
            localStorage.setItem('token', token)
            navigate('/room')
        }
        }catch(e){
            console.log(e);
        }
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your Account</CardTitle>
                    <CardDescription>
                        Enter your credentials to login your account
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    type="password"
                                    placeholder="Min 4"
                                    required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button onClick={loginRequest} type="submit" className="w-full">
                        Login
                    </Button>
                    <Link to={'/Signup'}>
                        <Button variant="link">Signup</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )

}