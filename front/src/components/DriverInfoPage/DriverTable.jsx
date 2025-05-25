const DriverTable = ({filteredDrivers, handleEditDriver, handleDelete, handleShowAssignments, isAdmin}) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ім'я</th>
                        <th>Досвід</th>
                        <th>Ліцензія</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDrivers.map((driver) => (
                        <tr key={driver.driverId}>
                            <td>{driver.driverId}</td>
                            <td>{driver.name}</td>
                            <td>{driver.experience}</td>
                            <td>{driver.license}</td>
                            <td>
                                {isAdmin && (
                                    <>
                                        <button className="button" onClick={() => handleEditDriver(driver)}>Редагувати</button>
                                        <button className="button delete" onClick={() => handleDelete(driver.driverId)}>Видалити</button>
                                    </>
                                )}
                                <button className="button assignments" onClick={() => handleShowAssignments(driver.driverId)}>📋 Призначення</button>
                            </td>
                        </tr>
                    ))}
                    {filteredDrivers.length === 0 && (
                        <tr><td colSpan="4">Нічого не знайдено</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default DriverTable;