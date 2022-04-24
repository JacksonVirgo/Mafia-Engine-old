import React, { useState } from "react";

export const RadioButton = ({ label, name, group, selected }) => {
    return <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    }}>
        <input type='radio' id={name} name={group} style={{ marginRight: '4px' }} defaultChecked={!!selected} />
        <label htmlFor={name}>{label}</label>
    </div>
}

export const TextField = ({ label, name, inline, placeholder, defaultValue }) => {
    return <div>
        <label htmlFor={name}>{label}</label> {inline ? <></> : <br />}
        <input id={name} name={name} placeholder={placeholder} style={{ width: '100%' }} defaultValue={defaultValue} />
    </div>
}