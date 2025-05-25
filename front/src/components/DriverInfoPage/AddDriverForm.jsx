const AddDriverForm = ({selectedDriver,name,experience,license,handleSaveDriver,resetForm,setName,setExperience,setLicense}) => {

    return (
        
            <div className="modal-content">
                <h2>{selectedDriver ? "Редагувати водія" : "Додати нового водія"}</h2>
                <input type="text" placeholder="Ім'я" value={name}
                    onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="Досвід" value={experience}
                    onChange={(e) => setExperience(e.target.value)} />
                <input type="text" placeholder="Ліцензія" value={license}
                    onChange={(e) => setLicense(e.target.value)} />
                <div className="modal-buttons">
                    <button className="button" onClick={handleSaveDriver}>
                        {selectedDriver ? "Зберегти" : "Додати"}
                    </button>
                    <button className="button cancel" onClick={resetForm}>Скасувати</button>
                </div>
            </div>
        
    )
}

export default AddDriverForm;