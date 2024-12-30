import { FaGithub } from "react-icons/fa";
const Footer = () => {
    return ( 
        <footer className="flex flex-col w-full h-[100px] gap-2 p-4 bg-[#DF9453] hover:bg-[#CD6A65] transition duration-300 ease-in-out text-white">
            {/* github icon */}
            <a className="font-semibold flex flex-row gap-2 items-center" href="https://github.com/guitar6029" target="_blank" rel="noreferrer" >My Github <FaGithub /></a>
            <span className="font-semibold">myPosts &copy; 2025</span>
        </footer>
     );
}
 
export default Footer;
