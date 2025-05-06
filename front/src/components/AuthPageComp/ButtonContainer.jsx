const ButtonContainer = ({ isLogin }) => {
    return (
      <div className="button-container">
        <button className="auth-button" type="submit">
          <span key={isLogin ? 'login' : 'register'}>
            {isLogin ? 'Login' : 'Register'}
          </span>
        </button>
      </div>
    );
  };
  
  export default ButtonContainer;
  