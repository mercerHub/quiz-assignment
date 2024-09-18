import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Button } from './ui/button'
import axiosInstance from '@/utils/axiosInstance'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


function DashboardContent() {
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate();

    const handleStartQuiz = async () => {
        setLoading(true)
        try {
           const response = await axiosInstance.get('/questions/getQuestions').then(res => res.data);
            localStorage.setItem('questions', JSON.stringify(response.data))

            navigate('/quiz')
            

        } catch (error : any) {
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center h-full'>
        <Card className='w-3/4 p-5'>
            <CardHeader className='flex items-center'>
                <span className='font-semibold text-lg'>
                    Let's get started !!!
                </span>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-4 text-center'>
                    <span className='text-gray-500'>
                        Welcome to the Quiz App. You can take quizzes, view your profile and update your settings from the sidebar.
                    </span>
                    <span className='text-gray-500'>
                        To get started, click on the start button.
                    </span>
                </div>
            </CardContent>
            <CardFooter className='flex items-center justify-center'>
                <Button 
                onClick={handleStartQuiz}
                variant={'default'} 
                className='w-1/2'>
                    {loading ? <Loader2 className='animate-spin'/>:"Start Quiz"}</Button>
            </CardFooter>
        </Card>
        </div>
    )
}

export default DashboardContent
