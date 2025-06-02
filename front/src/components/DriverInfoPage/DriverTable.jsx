import { FaUserEdit } from "react-icons/fa";
import { IoPersonRemoveOutline } from 'react-icons/io5';
import { RiCalendarScheduleLine } from 'react-icons/ri';

const DriverTable = ({driver,userRole,handleEditDriver,handleDelete,handleShowAssignments}) => {
    
    
    return (
                <div className="driver-card" key={driver.driverId}>
                    <div className="driver-card-header">
                        <h3>{driver.name}</h3>

                    </div>
                    <div className="driver-card-content">
                        <div className="driver-info-item">
                            <span className="info-label">Ліцензія:</span>
                            <span className="info-value">{driver.license}</span>
                        </div>
                        <div className="driver-info-item">
                            <span className="info-label">Досвід:</span>
                            <span className="info-value">{driver.experience} років</span>
                        </div>
                        <div className="driver-info-item">
                            <span className="info-label">ID:</span>
                            <span className="info-value">#{driver.driverId}</span>
                        </div>
                    </div>
                    <div className="driver-card-actions">
                        {userRole === 'admin' && (
                            <>
                                <button className="button edit" onClick={() => handleEditDriver(driver)}>
                                    <FaUserEdit className='edit-logo' /> Редагувати
                                </button>
                                <button className="button delete" onClick={() => handleDelete(driver.driverId)}>
                                    <IoPersonRemoveOutline className='edit-logo' /> Видалити
                                </button>
                            </>
                        )}
                        <button className="button schedule" onClick={() => handleShowAssignments(driver.driverId)}>
                            <RiCalendarScheduleLine className='edit-logo' style={{ color: 'white' }} /> Розклад
                        </button>
                    </div>
                </div>
            
    )
}

export default DriverTable;