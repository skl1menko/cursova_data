const RoleSelector = ({ role, onChange }) => {
    const roles = ['admin', 'dispatcher', 'user', 'driver'];

    return (
        <div className="select-menu">
            {roles.map((r) => (
                <label className="radio" key={r}>
                    <input
                        type="radio"
                        name="radio"
                        value={r}
                        checked={role === r}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <span className="name">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                </label>
            ))}
        </div>
    );
};

export default RoleSelector;
