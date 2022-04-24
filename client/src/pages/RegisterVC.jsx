import React from 'react'

const BG_LIGHT = 'rgb(39, 41, 52)'
const BG_DARK = 'rgb(31, 33, 41)'

const wholePage = {
    width: '100vw',
    height: '100vh',
    backgroundColor: BG_LIGHT,
    color: 'white',
    foregroundColor: 'white',

    display: 'flex',
    flexDirectioN: 'column'
}

const sideBar = {
    backgroundColor: BG_DARK,
    padding: '16px'
}

const contentBar = {
    flexGrow: '1',
    padding: '16px'
}

export default function RegisterVC() {
    return (
        <div style={wholePage}>
            <div style={sideBar}>Why hello there</div>
            <div style={contentBar}>
                <form></form>
            </div>
        </div>
    )
}
