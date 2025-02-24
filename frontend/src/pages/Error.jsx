import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
    const navigate = useNavigate()
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            navigate("/dashboard")
        }, 2000)

        // Cleanup timeout on component unmount
        return () => clearTimeout(timeoutId)
    }, []) // Empty dependency array ensures it runs once on mount
    
    return (
        <div className="flex justify-center items-center w-full h-screen bg-red-100">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-red-600">You're not supposed to be here</h1>
                <p className="mt-4 text-gray-700">Redirecting to the homepage...</p>
            </div>
        </div>
    )
}

export default Error
