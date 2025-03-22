import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
    const navigate = useNavigate();
    const [dots, setDots] = useState('');

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);

        const timeoutId = setTimeout(() => {
            navigate('/dashboard');
        }, 2500);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(dotInterval);
        };
    }, []);

    return (
        <div className="flex justify-center items-center w-full h-screen bg-red-100 animate-fadeIn">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-red-600">Oops! Wrong Turn</h1>
                <p className="mt-3 text-gray-700">
                    You seem lost. Taking you back home{dots}
                </p>
                <div className="mt-4 flex justify-center">
                    <div className="w-5 h-5 border-4 border-red-500 border-dashed rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default Error;
