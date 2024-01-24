import React from 'react';
import Image from 'next/image';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';

const SignInPage: React.FC = () => {
    return (
        <div className="">
            <div className="bg-slate-400 rounded-3xl mt-5 h-full flex flex-row">
                <div className="basis-1/4">
                    <div className="text-zinc-700 font-bold text-3xl ml-7 mt-12">Welcome to </div>
                    <br />
                    <div className="text-zinc-700 font-bold text-4xl font-bold text-zinc ml-7 mt-1">LifeMate</div>
                </div>
                <div className="basis-3/4">
                    <div className='pl-60 pt-10 pb-10'>
                        <Image
                            src="/signup_image.png"
                            alt="Signup Image"
                            width={300}
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
