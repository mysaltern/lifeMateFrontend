import React from 'react';
import Image from 'next/image';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import LayoutLogin from '../latout_login/page';
import LayoutLoginFooter from '../latout_login_footer/page';

const SignInPage: React.FC = () => {
    return (
        <div className="container mx-auto bg-slate-800">

            <LayoutLogin />

            <div id='signup' className="text-center">
                <div className='text-4xl font-bold text-slate-50 text-center  mt-10 mr-40'>
                    Sign In
                </div>

                <div className='flex items-center justify-center'>
                    <div className='relative mt-5 rounded-lg p-1 bg-slate-600  w-72' >
                        <input className='pl-4 bg-transparent text-white placeholder-white rounded-lg p-1 w-full' type='text' placeholder='Enter your email' />
                        <div className='absolute inset-y-0 right-1 flex items-center'>
                            <FontAwesomeIcon icon={faEnvelope} className='text-gray-400 mr-3 w-5 mx-auto' />
                        </div>
                    </div>
                </div>
                <br />
                <div className='flex items-center justify-center'>
                    <div className='relative rounded-lg p-1 bg-slate-600  w-72' >
                        <input className='pl-4 bg-transparent text-white placeholder-white rounded-lg p-1 w-full' type='text' placeholder='Enter your password' />
                    </div>
                </div>

                <div className='flex items-center justify-center'  >
                    <div className='relative mt-6 rounded-lg bg-slate-600 p-1 w-72 cursor-pointer'  >
                    <Link className='ml-1' href="/chat">
                        <button className='h-8 px-6 text-indigo-100 transition-colors duration-150 rounded-lg focus:shadow-outline'>


                          Signin

                        </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center mt-4'>

                <Link className='ml-1' href="/forgot">forgot you password? </Link>
            </div>
            <LayoutLoginFooter />


        </div>
    );
};

export default SignInPage;
