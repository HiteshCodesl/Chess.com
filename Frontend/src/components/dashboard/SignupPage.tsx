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

export function SignupPage() {
        const [email, setEmail] = useState("");
        const [name, setName] = useState("");
        const [password, setPassword] = useState("");
        
        const navigate = useNavigate();
    
        const signupRequest = async() => {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {email, name, password});
            if(response){
                const data  = response.data;
                console.log(data);
                navigate('/room')
            }
        }
    
    return (
        <div className="h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm ">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your credentials to login to your account
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
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    id="name"
                                    type="text"
                                    placeholder="harkirat singh"
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
                                required 
                                placeholder="Min 4" 
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button onClick={signupRequest} type="submit" className="w-full">
                        Signup
                    </Button>
                    <Link to={'/login'}>
                     <Button variant="link">Login</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}