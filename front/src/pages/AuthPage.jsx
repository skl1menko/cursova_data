// src/pages/AuthPage.js
import '../pages/AuthPage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import InputGroup from '../components/AuthPageComp/InputGroup';
import RoleSelector from '../components/AuthPageComp/RoleSelector';
import ButtonContainer from '../components/AuthPageComp/ButtonContainer';
import RegContainer from '../components/AuthPageComp/RegContainer';
import { getUser, registerUser } from '../api/user_api.js';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const { login } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUser();
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            const matchedUser = users.find(
                (user) => user.username === username && user.password === password
            );

            if (matchedUser) {
                login(matchedUser.role);
                switch (matchedUser.role) {
                    case 'admin':
                        navigate('/admin-dashboard');
                        break;
                    case 'dispatcher':
                        navigate('/dispatcher-panel');
                        break;
                    case 'user':
                        navigate('/user-home');
                        break;
                    case 'driver':
                        navigate('/driver-info');
                        break;
                    default:
                        showToast.error('Unknown role');
                }
            } else {
                showToast.error('Invalid credentials');
            }
        } else {
            const newUser = { username, password, role };

            try {
                await registerUser(newUser);
                showToast.success('Registration successful');
                setIsLogin(true);
            } catch (error) {
                showToast.error(`Error during registration: ${error.message}`);
            }
        }
    };

    return (
        <div className='auth-body'>
            <div className="matte-block">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h1 className="auth-header" key={isLogin ? 'login' : 'register'}>
                        {isLogin ? 'Login' : 'Register'}
                    </h1>
                    <InputGroup type="text" value={username} label="Username" onChange={setUsername} />
                    <InputGroup type="password" value={password} label="Password" onChange={setPassword} />
                    <div className={`role-selector-wrapper ${!isLogin ? 'visible' : ''}`}>
                        <RoleSelector role={role} onChange={setRole} />
                    </div>

                    <ButtonContainer key={isLogin ? 'login-btn' : 'register-btn'} isLogin={isLogin} />
                    <RegContainer isLogin={isLogin} onClick={() => setIsLogin(!isLogin)} />
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
