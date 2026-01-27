import React from 'react'
import { OrbitalLoader } from './ui/orbital-loader'

function CustomLoader() {
    return (
        <>
            <div className={`flex justify-center items-center h-screen w-screen absolute bg-white/70 z-50`}>
                <OrbitalLoader message="Please wait..." className="size-20" />
            </div>
        </>
    )
}

export default CustomLoader
