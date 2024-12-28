import { Link } from "react-router-dom";
import { links } from "../links/navlinks";
import { LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    
    const navigate = useNavigate();
    
    const handleLogOut = () => {
        //clear local session storage and redirec to landing page
        sessionStorage.clear();
        //redirect to landing page
        navigate('/');
    }
    
    return (
        <>
            <div className="flex flex-row justify-between w-full items-center gap-2 p-2 bg-[#DF9453] hover:bg-[#CD6A65] transition duration-300 ease-in-out mb-2 rounded-lg">
                <div className="flex flex-row items-center">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        className="text-white rounded-sm text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl p-2 font-extrabold hover:bg-[#5C211E] transition duration-300 ease-in-out "
                        to={link.path}
                    >
                        {link.name}
                    </Link>
                )).slice(0,2)}
                </div>
                <div className="flex flex-row items-center gap-2">
                {links.slice(2).map((link, index) => (
                    <Link
                        key={index}
                        className="text-white rounded-sm text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl p-2 font-extrabold hover:bg-[#5C211E] transition duration-300 ease-in-out "
                        to={link.path}
                    >
                        {link.name}
                    </Link>
                ))}
                <button onClick={handleLogOut}className="flex flex-row items-center gap-2 p-2"><LogOut className="text-white" size={10} /></button>
                </div>
            </div>
        </>
    );
};

export default NavBar;
