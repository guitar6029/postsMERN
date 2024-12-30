import styles from './modal.module.css';
import { TriangleAlert, X } from 'lucide-react';

const Modal = ({ title, typeOfConfirmation, onClose, onDelete }) => {

    const handleExternalClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }


    const getTtext = () => {
        if (typeOfConfirmation === "delete") {
            return (

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row justify-end">
                        <div className="p-2 text-gray-500 border border-gray-300 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110" onClick={onClose}>
                            <X size={20} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center">

                        <TriangleAlert size={40} className="p-2 text-red-600 bg-red-200 rounded-lg " />
                        <h3 className="text-xl font-bold">Are you sure?</h3>
                        <p className="text-sm text-gray-500">Are you sure you want to delete this post</p>
                        <p className="text-sm text-gray-500">This action cannot be undone</p>
                    </div>
                    <div className="flex flex-col w-full gap-2 items-center">
                        <button className="p-2 border text-white font-medium bg-red-500 w-full border-gray-200  rounded-lg" onClick={onDelete}>Delete</button>
                        <button className="p-2 border border-gray-300 font-medium   w-full rounded-lg " onClick={onClose}>Cancel</button>

                    </div>
                </div>

            )

        }

    }

    return (
        <div onClick={handleExternalClick} className={styles.modalExternal}>
            <div className={styles.modal}>
                {title && <h2 className="text-2xl font-bold">{title}</h2>}
                {getTtext()}
            </div>
        </div>
    );
}

export default Modal