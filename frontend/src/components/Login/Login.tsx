import React, { useContext } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import {LoaderCircle} from 'lucide-react'
import axiosInstance from '@/utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '@/contexts/AuthContext'
import Session from '@/models/session'


function Login() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate();

    const { setSession } = useContext(AuthContext);


    const handleSignIn = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.post('/users/login', {email, password});
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.data.loggerUser));
            const {accessToken, refreshToken, loggerUser:user} = response.data.data;
            setSession({accessToken, refreshToken, user});
        } catch (error : any) {
            
            setError(error.message)
            console.error(error)
            
        }finally{
            setLoading(false)
            navigate('/dashboard')
        }
    }
    const gotoSignUp = () => {
        navigate('/signup');
    }
    return (
        <>
            <div className='flex items-center justify-center min-h-screen h-fit w-screen bg-ring'>
                <Card className='w-[450px] items-center'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>
                            Sign In
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center gap-5'>
                        <div className='flex flex-col space-y-1.5 w-full'>
                            <Label
                                htmlFor="email"
                                className='text-sm'
                            >Email:</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                autoComplete='off'
                            />
                        </div>
                        <div className='flex flex-col space-y-1.5 w-full'>
                            <Label
                                htmlFor="password"
                                className='text-sm'
                            >Password:</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>

                    </CardContent>
                    <CardFooter className='flex flex-col gap-2 items-center justify-center w-full'>
                        <div className='flex justify-between w-full'>
                            <Button
                                variant={'outline'}
                                onClick={gotoSignUp}>
                                Sign up
                            </Button>
                            <Button onClick={handleSignIn}>{loading ? <LoaderCircle className='animate-spin' /> : "Sign In"}</Button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default Login
