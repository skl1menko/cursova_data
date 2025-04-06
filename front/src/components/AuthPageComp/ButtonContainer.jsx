const ButtonContainer = ({ isLogin }) => (
    <div className="button-container">
        <button className="auth-button" type="submit">
            {isLogin ? 'Login' : 'Register'}
        </button>
    </div>
);

export default ButtonContainer;