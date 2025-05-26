const AddBussBut = ({setShowAddForm}) => {
    return (
        <div className="addbut-container">
            <button className="button add-bus-button" onClick={() => setShowAddForm(true)}>
                ➕ Додати автобус
            </button>
        </div>
    )
}
export default AddBussBut;