import { useState } from "react";
import { Link } from "react-router-dom";
import { links } from "../links/navlinks";
import { LogOut, CircleUserRound, CreditCard, UserRound } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

const NavBar = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleShowDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    const handleLogOut = () => {
        // Clear local session storage and redirect to landing page
        sessionStorage.clear();
        navigate('/');
    }

    const handleGoToProfile = () => {
        setShowDropdown(false);
        //navigate to /account
        navigate("/account")
    }

    const handleRedirect = (path) => {
        switch (path) {
            case 'profile':
                setShowDropdown(false);
                navigate("/account");
                break;
            case 'subscription':
                setShowDropdown(false);
                navigate("/subscription");
                break;
            case 'logout':
                handleLogOut();
                break;
            default:
                break;
        }
    }

    //detect click outside of dropdwn and close it
    // const handleClickOutside = (event) => {
    //     if (showDropdown && !event.target.closest('.dropdown')) {
    //         setShowDropdown(false);
    //     }
    // };

    // document.addEventListener('click', handleClickOutside);

    return (
        <>
            <div className="flex flex-row justify-between w-full items-center gap-2 p-1 bg-[#DF9453] hover:bg-[#CD6A65] transition duration-300 ease-in-out mb-2">
                <div className="flex flex-row items-center">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            className="text-white rounded-sm text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl p-2 font-extrabold hover:bg-[#5C211E] transition duration-300 ease-in-out"
                            to={link.path}
                        >
                            {link.name}
                        </Link>
                    )).slice(0, 2)}
                </div>
                <div className="relative">
                    <button onClick={handleShowDropdown} className="rounded-full p-2 hover:bg-[#5C211E] transition duration-300 ease-in-out">
                        <CircleUserRound className="text-white" size={20} />
                    </button>
                    {showDropdown && (
                        <div className="flex flex-col absolute right-0 mt-1 p-2 w-[250px] h-56 bg-white rounded-lg shadow-xl dropdown z-50">
                            <div className="flex flex-col h-full justify-between">

                                <div className="flex flex-col gap-2">

                                    {/* top section */}
                                    <div className="flex flex-row items-center ">
                                        <div className="w-1/4 flex flex-row justify-center">
                                            <CircleUserRound className="text-black" size={40} />
                                        </div>
                                        <div className="flex w-3/4 flex-col gap-1">
                                            <span>{user?.firstName} {user?.lastName}</span>
                                            <span>{user?.email}</span>
                                        </div>
                                    </div>

                                    {/* middle section */}
                                    <div className="flex flex-col gap-1 p-2">
                                        <hr style={{ height: "2px", backgroundColor: '#DF9453', border: 'none' }} />
                                        <div onClick={() => handleRedirect('profile')} className="flex flew-row items-center gap-1 hover:cursor-pointer">
                                            <UserRound className="text-black" size={20} />
                                            <span >View Profile</span>
                                        </div>
                                        <div onClick={() => handleRedirect('subscription')} className="flex flex-row items-center gap-1 hover:cursor-pointer">
                                            <CreditCard className="text-black" size={20} />
                                            <span >Subscription</span>
                                        </div>
                                        <hr />
                                    </div>
                                </div>


                                {/* bottom section */}
                                <div className="flex flex-col p-2">
                                    <div onClick={() => handleRedirect('logout')} className="flex flex-row items-center gap-1 hover:cursor-pointer">
                                        <LogOut className="text-black" size={20} />
                                        <span className=" text-gray-800 hover:bg-gray-200 cursor-pointer">Sign Out</span>
                                    </div>

                                </div>

                            </div>

                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NavBar;
