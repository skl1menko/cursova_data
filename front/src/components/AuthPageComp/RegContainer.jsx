import '../AuthPageComp/RegContainer.css'

const RegContainer = ({ isLogin, onClick }) => {
    return (
        <div className="reg-container">
            <p onClick={onClick} className="toggle-link">
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
        </div>
    );
};

export default RegContainer;