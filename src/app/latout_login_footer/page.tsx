
'use client';
import React from 'react';
import Image from 'next/image';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import { usePathname  } from 'next/navigation';

const LayoutLoginFooter: React.FC = () => {
    const pathname  = usePathname  ();
    console.log(pathname );
        return (
        <div className="">
            <div id='line' className='text-center mt-7'>
                <div className='flex items-center justify-center'>
                    <div className='bg-white w-28 h-[2px] relative'></div>
                    <div className='mx-4 text-white text-xl'>or</div>
                    <div className='bg-white w-28 h-[2px] relative'></div>
                </div>
            </div>


            <div id='line' className='text-center mt-7'>
                <div className='flex items-center justify-center'>
                    <button className="w-32 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">Google</button>

                    <button className="w-32 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">Facebook</button>


                </div>
            </div>
            <div className='flex items-center justify-center mt-10'>
                {pathname  === '/signin' ? (
                    <span>Do you want to create an account? <Link className='ml-1' href="/signup">Sign up now</Link></span>
                ) : (
                    <span>Do you have an account? <Link className='ml-1' href="/signin">Sign in now</Link></span>
                )}
            </div>

        </div>
    );
};

export default LayoutLoginFooter;
