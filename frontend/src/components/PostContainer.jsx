import { getDateString } from '../utils/DateUtil';
import { getColor } from '../utils/Colors';
import { Link } from 'react-router-dom';

const PostContainer = ({ post, index }) => {
    const getBgColor = (index) => { return { backgroundColor: getColor(index) }; };
    const bgColorStyle = getBgColor(index);

    return (
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
                <span className="text-xs ">{getDateString(post.dateCreated)}</span>
            </div>
        </Link>
    );
}

export default PostContainer;
