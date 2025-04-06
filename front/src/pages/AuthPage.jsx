import '../PageStyles/AuthPage.css';
import { useState } from 'react'

const AuthPage = () => {

    
    const [isLogin, setIsLogin] = useState(true);
    return (
        <div className='auth-body'>
            <div className="matte-block">
                <form className="auth-form">
                    <h1 className="auth-header">{isLogin ? 'Login' : 'Register'}</h1>
                    <div className="input-group">
                        <input className="input" type="text" required />
                        <label className='input-label'>Username</label>
                        <div className="underline"></div>
                    </div>
                    <div className="input-group">

                        <input className="input" type="password" required />
                        <label className='input-label'>Password</label>
                        <div className="underline"></div>
                    </div>
                    <div className="select-menu">
                        <label className='radio'>
                            <input type="radio" name="radio" />
                            <span className="name">Admin</span>
                        </label>
                        <label className='radio'>
                            <input type="radio" name="radio" />
                            <span className="name">Despetcher</span>
                        </label>
                        <label className='radio'>
                            <input type="radio" name="radio" />
                            <span className="name">User</span>
                        </label>
                        <label className='radio'>
                            <input type="radio" name="radio" />
                            <span className="name">Driver</span>
                        </label>
                    </div>
                    <div className='button-container'>
                        <button className="auth-button" type="submit">{isLogin ? 'Login' : 'Register'}</button>
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
}

export default AuthPage;