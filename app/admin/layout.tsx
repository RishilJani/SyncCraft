import React from 'react'

function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className='flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8'>
                <div className='w-full space-y-8 max-w-7xl mx-auto'>
                    {children}
                </div>
            </div>
        </>
    )
}

export default AdminLayout
