import React from 'react';

const InputGroup = ({type , value, label, onChange}) => {
    return (
        <div className="input-group">
            <input
                className="input"
                type={type}
                required
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <label className='input-label'>{label}</label>
            <div className="underline"></div>
        </div>
    );
}

export default InputGroup;
