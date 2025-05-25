import { IoMdAddCircleOutline } from "react-icons/io";

const AddDriverBut = ({setShowAddForm}) => {
    return (
        <div className="addbut-container">
            <button className="button add-driver-button" onClick={() => setShowAddForm(true)}>
            <IoMdAddCircleOutline className="edit-logo" style={{color: ''}}/> Додати водія
            </button>
        </div>
    )
}

export default AddDriverBut;        