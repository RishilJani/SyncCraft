import { OrbitalLoader } from '@/components/ui/orbital-loader'
import React from 'react'

function LoadingComponent() {
    return (
        <>
            <div className={`flex justify-center items-center h-screen w-screen absolute bg-white/70 z-50`}>
                <OrbitalLoader message="Please wait..." className="size-20" />
            </div>
        </>
    )
}

export default LoadingComponent
