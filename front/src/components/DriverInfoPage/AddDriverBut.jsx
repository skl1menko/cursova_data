const AddDriverBut = ({setShowAddForm}) => {
    return (
        <div className="addbut-container">
            <button className="button add-driver-button" onClick={() => setShowAddForm(true)}>
                ➕ Додати водія
            </button>
        </div>
    )
}

export default AddDriverBut;        