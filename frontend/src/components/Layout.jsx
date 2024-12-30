import NavBar from "./Navbar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="w-full">
                <NavBar />
            </header>
            <main className="flex-grow p-4">
                <Outlet />
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </main>
            {/* <footer className="w-full">
                <Footer />
            </footer> */}
        </div>
    );
};

export default Layout;
