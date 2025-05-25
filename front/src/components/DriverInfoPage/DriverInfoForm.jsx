const DriverInfoForm = ({assignments,setShowAssignmentsModal}) => {
    return (
        <div className="modal-content-dr">
            <h2>Призначення водія</h2>
            <ul>
                {assignments.map((assignment, index) => (
                    <li key={index}>
                        {`Маршрут: ${assignment.scheduleId}, Час відправлення: ${assignment.firstDepartureTime} — ${assignment.lastDepartureTime}`}
                    </li>
                ))}
            </ul>
            <div className="modal-buttons">
                <button className="button cancel" onClick={() => setShowAssignmentsModal(false)}>Закрити</button>
            </div>
        </div>
    )
}

export default DriverInfoForm;