import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { FaBus } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { LiaRouteSolid } from "react-icons/lia";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useNavigate } from 'react-router';
import '../components/SideBar.css';
const SideBar = () => {

    const navigate = useNavigate();

    return (
        <div className="flex items-center bg-black">
            <div className="sd-ct bg-black">
                <Sidebar color="white" className="">
                    <SidebarItems className="">
                        <SidebarItemGroup >
                            <SidebarItem color="black" icon={FaBus} onClick={() => navigate('/admin-dashboard')}>
                                Buses
                            </SidebarItem>
                            <SidebarItem  icon={GiSteeringWheel} onClick={() => navigate('/dispatcher-panel')}>
                                Drivers
                            </SidebarItem>
                            <SidebarItem icon={LiaRouteSolid}>
                                Routes and Stops
                            </SidebarItem>
                            <SidebarItem icon={RiCalendarScheduleLine}>
                                Schedule
                            </SidebarItem>
                            <SidebarItem >
                                Trips
                            </SidebarItem>
                            <SidebarItem >
                                Load
                            </SidebarItem>
                        </SidebarItemGroup>
                    </SidebarItems>
                </Sidebar>
            </div>
        </div>
    )
}
export default SideBar;