import React, { useState, useEffect } from 'react'
import AdminNavBar from '../AdminNavBar/AdminNavBar'
import { Status } from '../SkeletonCards/SkeletonCards';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';

const AdminStatus: React.FC = () => {

    const [N, setN] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);

    const adjust_N = () => {
        if (window.innerWidth <= 640) {
            return setN(4)
        } else if (window.innerWidth <= 1024) {
            return setN(6)
        } else if (window.innerWidth <= 1280) {
            return setN(9)
        } else {
            return setN(12)
        }
    }

    useEffect(() => {
        adjust_N();
        window.addEventListener('resize', adjust_N);

        return () => {
            window.removeEventListener('resize', adjust_N);
        }
    }, [])

    useEffect(() => {
        if (localStorage.getItem("ACM_SIST_TOKEN") == null) {
            location.href = "/admin/login"
        }
    }, [])

  return (
    <>
        <AdminNavBar />
        <h1 className='tw-font-semibold tw-text-sky-400 tw-text-center tw-text-2xl'>Status</h1>
        <br />
        <div className='tw-relative tw-container sm:tw-w-1/2'>
            <Filter className='tw-absolute tw-translate-y-2 tw-translate-x-4 tw-text-gray-400' />
            <Input className='tw-px-9 tw-mx-2' placeholder='Filter by register number'  />
        </div>
        <br />
        <div className='tw-grid tw-gap-1 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4'>
            {
                dataLoaded ? (
                    <></>
                ) : (
                    [...Array(N)].map((v) => (
                        <Status key={v} />
                    ))
                )
            }
        </div>
    </>
  )
}

export default AdminStatus