import '../PageStyles/AuthPage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import InputGroup from '../components/AuthPageComp/InputGroup';
import RoleSelector from '../components/AuthPageComp/RoleSelector';
import ButtonContainer from '../components/AuthPageComp/ButtonContainer';
import RegContainer from '../components/AuthPageComp/RegContainer';
//import { getUser } from '../api/api.js'; // Імпорт функції для отримання користувачів

const API_URL = "http://localhost:5227/api";

export const getUser = async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
}

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await getUser();
            setUsers(usersData);
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            // Находимо користувача по username та password
            const matchedUser = users.find(
                (user) => user.username === username && user.password === password
            );

            if (matchedUser) {
                // Перенаправлення в залежності від ролі користувача
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
                        alert('Unknown role');
                }
            } else {
                alert('Invalid credentials');
            }
        } else {
            // Логіка для реєстрації
            const newUser = {
                username,
                password,
                role,
            };

            try {
                const response = await fetch(`${API_URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    alert(errorMessage);
                } else {
                    alert('Registration successful');
                    setIsLogin(true); // Повернутися до форми входу
                }
            } catch (error) {
                alert('Error during registration');
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
