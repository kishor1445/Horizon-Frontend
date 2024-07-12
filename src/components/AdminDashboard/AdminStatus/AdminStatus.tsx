import React, { useState, useEffect } from 'react'
import AdminNavBar from '../AdminNavBar/AdminNavBar'
import { Status } from '../SkeletonCards/SkeletonCards';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import client from '@/lib/axios_utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

type Team = {
    reg_no: number,
    name: string,
    department: string,
    section: string,
    year: number
}

type Status = {
    name: string,
    reg_no: number,
    team?: Team[],
    transaction_id: string,
    screenshot_url: string,
    department: string,
    section: string, 
    year: number,
    whatsapp?: number,
    email: string,
    event_id: string,
    _id: string,
    status: string,
    attended: boolean
}

const year_map = new Map<number, string>();
year_map.set(1, "st");
year_map.set(2, "nd");
year_map.set(3, "rd");
year_map.set(4, "th");

const AdminStatus: React.FC = () => {

    const [N, setN] = useState(0);
    const [Loading, setLoading] = useState(true);
    const [StatusData, setStatusData] = useState<Status[]>([]);

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

    const get_all_status = async () => {
        await client.get("/admin/status", {
            "headers": {
                "Authorization": "Bearer " + localStorage.getItem('ACM_SIST_TOKEN')
            }
        }).then((res) => {
            setStatusData(res.data);
            setLoading(false);
        }).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/admin/login"
            }
        })
    }

    useEffect(() => {
        adjust_N();
        window.addEventListener('resize', adjust_N);
        
        if (localStorage.getItem("ACM_SIST_TOKEN") == null) {
            location.href = "/admin/login"
        }

        get_all_status()

        return () => {
            window.removeEventListener('resize', adjust_N);
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
                Loading ? (
                    [...Array(N)].map((v) => (
                        <Status key={v} />
                    ))
                ) : (
                    StatusData.map((value, index) => (
                        <Card key={index} className='tw-m-2'>
                            <CardHeader>
                                <CardTitle>
                                    {value.name}
                                </CardTitle>
                                <CardDescription>
                                    {value.email}<br /><b>Event ID</b>: {value.event_id}<br /><b>Transaction ID</b>: {value.transaction_id}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <a href={value.screenshot_url} target='_blank'><img src={value.screenshot_url}></img></a>
                                <div className='tw-flex tw-justify-end tw-mt-5'>
                                    <Drawer>
                                        <DrawerTrigger className='tw-text-primary'>More Details</DrawerTrigger>
                                        <DrawerContent>
                                            <DrawerHeader>
                                                <DrawerTitle>
                                                    <b>Name:</b> {value.name} <span className='tw-text-primary'>|</span> <b>Reg No:</b> {value.reg_no}
                                                </DrawerTitle>
                                                <DrawerDescription>
                                                    <p><b className='tw-text-primary'>Class:</b> {value.department} ({value.section})</p>
                                                    <p><b className='tw-text-primary'>Year:</b> {value.year}<sup>{year_map.get(value.year)}</sup> Year</p>
                                                    <p><b className='tw-text-primary'>Email:</b> {value.email}</p>
                                                    {
                                                        value.team ? (
                                                            <>
                                                                <b className='tw-text-primary'>Team<span className='tw-hidden sm:tw-inline-block'>:</span></b>
                                                                <div className='tw-mx-5'>
                                                                    {
                                                                        value.team.map((team_value, team_index) => (
                                                                            <>
                                                                                <p key={team_index}>
                                                                                    <b className='tw-text-yellow-400'>Name:</b> {team_value.name}<br />
                                                                                    <b className='tw-text-yellow-400'>Reg No:</b> {team_value.reg_no} <br />
                                                                                    <b className='tw-text-yellow-400'>Class:</b> {team_value.department} <br />
                                                                                    <b className='tw-text-yellow-400'>Year:</b> {team_value.year}<sup>{year_map.get(team_value.year)}</sup> Year<br />
                                                                                </p>
                                                                                <hr className='tw-border-primary tw-my-2' />
                                                                            </>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </>
                                                        ): <></>
                                                    }
                                                </DrawerDescription>
                                            </DrawerHeader>
                                            <DrawerFooter>
                                                <DrawerClose>
                                                    <Button variant={'outline'}>Close</Button>
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )
            }
        </div>
    </>
  )
}

export default AdminStatus