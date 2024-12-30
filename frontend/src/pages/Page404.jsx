import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Page404 = () => {

    const navigate = useNavigate();
    return ( 
        <div>
            <h1>Page not found</h1>
            <span>Go back to previous page or go to <span className="cursor-pointer text-sky-600" onClick={() => navigate(-1)}>Home </span></span>
        </div>
     );
}
 
export default Page404;