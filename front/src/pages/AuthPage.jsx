import '../PageStyles/AuthPage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const API_URL = "http://localhost:5227/api/users";

export const getUser = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLogin) {
            // Находим пользователя по username и password
            const matchedUser = users.find(
                (user) => user.username === username && user.password === password
            );

            if (matchedUser) {
                // Перенаправление в зависимости от роли пользователя
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
            // Логика для регистрации
            alert(`Registered as ${role}`);
            setIsLogin(true); // Возврат в форму логина
        }
    };

    return (
        <div className='auth-body'>
            <div className="matte-block">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h1 className="auth-header">{isLogin ? 'Login' : 'Register'}</h1>
                    <div className="input-group">
                        <input
                            className="input"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className='input-label'>Username</label>
                        <div className="underline"></div>
                    </div>
                    <div className="input-group">
                        <input
                            className="input"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className='input-label'>Password</label>
                        <div className="underline"></div>
                    </div>

                    {!isLogin && (
                        <div className="select-menu">
                            {['admin', 'dispatcher', 'user', 'driver'].map((r) => (
                                <label className='radio' key={r}>
                                    <input
                                        type="radio"
                                        name="radio"
                                        value={r}
                                        checked={role === r}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    <span className="name">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    <div className='button-container'>
                        <button className="auth-button" type="submit">
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </div>

                    <div className="reg-container">
                        <p onClick={() => setIsLogin(!isLogin)} className="toggle-link">
                            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
