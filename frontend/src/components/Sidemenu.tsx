import React from 'react'
import { NavLink } from 'react-router-dom'
import { BrainCircuit, LogOut, SquareTerminal, User2Icon, PuzzleIcon } from 'lucide-react';

interface NavLinkItem {
    title: string;
    url: string;
    icon: React.ReactNode;
}

const navLinks: NavLinkItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: <SquareTerminal size={24} /> },
    { title: 'Profile', url: '/profile', icon: <User2Icon /> },
    { title: 'Settings', url: '/settings', icon: <BrainCircuit /> },
    { title: 'Logout', url: '/logout', icon: <LogOut /> },
];

function Sidemenu() {
    return (
        <div className="flex flex-col gap-10 p-3 m-2 my-8 h-1/2">
            <span className="flex items-center gap-4 text-gray-300 font-normal">
                <PuzzleIcon width={50} height={50}/>
                <span className='hidden md:block text-3xl'>Quiz</span>
            </span>
            <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.url}
                        className={({ isActive }) =>
                            `flex items-center gap-4 font-normal text-base transition-all duration-200 ease-in-out ${isActive ? "text-gray-400" : "text-gray-300 hover:text-gray-400"}`
                        }
                    >
                        <span className=''>{link.icon}</span>
                        <span className='hidden md:block'>{link.title}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default Sidemenu;
