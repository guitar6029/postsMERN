import { getDateString } from '../utils/DateUtil';
import { getColor } from '../utils/Colors';
import { Link } from 'react-router-dom';

const PostContainer = ({ post, index, viewType = 'preview' }) => {
    const getBgColor = (index) => {
        return { backgroundColor: getColor(index) };
    };
    const bgColorStyle = getBgColor(index);

    // Return the JSX structure properly
    return (
        <>
            {viewType === 'preview' && (
                <Link
                    to={`/readpost/${post._id}`}
                    className="block w-full transition duration-300 ease-in hover:cursor-pointer"
                    style={bgColorStyle}
                >
                    <div
                        key={post.id}
                        className="flex flex-row gap-2 items-center text-white p-1 h-12 max-h-13"
                    >
                        <span className="text-xs font-semibold truncate text-ellipsis w-2/4">{post.title}</span>
                        <span className="text-xs w-1/4">{post.author}</span>
                        <span className="text-xs">{getDateString(post.dateCreated)}</span>
                    </div>
                </Link>
            )}
            {viewType === "list" && (
                <div className="block w-full transition duration-300 ease-in hover:cursor-pointer"
                    style={bgColorStyle} >

                    <div
                        key={post.id}
                        className="flex flex-row gap-2 items-center text-white p-1 h-12 max-h-13"
                    >
                        <span className="text-xs font-semibold truncate text-ellipsis w-1/6">{post.title}</span> 
                        <span className="text-xs truncate text-ellipsis w-4/6">{post.description}</span>
                        <span className="text-xs w-1/6">{getDateString(post.dateCreated)}</span>
                    </div>
                </div>
            )}
            {viewType === "grid" && (
                <div className="flex flex-col p-2 rounded-lg min-h-[100px] max-h-[250px] overflow-hidden" style={bgColorStyle}>
                <span className="text-xs font-semibold truncate text-ellipsis">{post.title}</span>
                <p className="text-xs truncate text-ellipsis">{post.description}</p>
                <span className="text-xs">{getDateString(post.dateCreated)}</span>
            </div>
            )}
        </>
    );
};

export default PostContainer;
