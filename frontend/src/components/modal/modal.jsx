import styles from './modal.module.css';

const Modal = ( {title, typeOfConfirmation, onClose, onDelete}) => {

    const handleExternalClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }


    const getTtext = () => {
        if (typeOfConfirmation === "delete") {
           return (
            
                <div className="flex flex-col items-center gap-2">
                    <span>Are you sure you want to delete ?</span>
                    <div className="flex flex-row gap-2 items-center">
                        <button className="p-2 text-white bg-sky-600 rounded-lg " onClick={onClose}>Cancel</button>
                        <button className="p-2 text-white bg-red-600 rounded-lg" onClick={onDelete}>Delete</button>

                    </div>
                </div>
        
           ) 
           
        }

    }

    return (
        <div onClick={handleExternalClick} className={styles.modalExternal}>
            <div className={styles.modal}>
                <h2>{title}</h2>
                {getTtext()}
            </div>
        </div>
    );
}

export default Modal