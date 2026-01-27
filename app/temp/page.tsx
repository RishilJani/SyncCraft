"use client"
import { Button } from '@/components/ui/button'
import React from 'react'

function TempPage() {
    async function handleClick() {
        console.log("Calling the api... ");
        const data = await(await fetch(`api/projects/${1}`)).json();
        console.log("data = ", data);
        
    }
    return (
        <>
            <Button variant="outline" className='btn' onClick={handleClick}> Click here</Button>
        </>
    );
}

export default TempPage
