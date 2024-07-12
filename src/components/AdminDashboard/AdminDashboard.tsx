import React, { useState, useEffect } from 'react'
import AdminNavBar from './AdminNavBar/AdminNavBar'
import { Status } from './SkeletonCards/SkeletonCards'
import client from '@/lib/axios_utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';

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


const AdminDashboard: React.FC = () => {

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

    const get_pending_status = async () => {
        await client.get("/admin/events/pending_verification", {
            "headers": {
                "Authorization": "Bearer " + localStorage.getItem("ACM_SIST_TOKEN")
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

    const send_payment_status = async (data: Status, status: string) => {
        setLoading(true);
        await client.post("/admin/events/pending_verification", {
            "reg_no": data.reg_no,
            "event_id": data.event_id,
            "status": status
        }, {
            "headers": {
                "Authorization": "Bearer " + localStorage.getItem("ACM_SIST_TOKEN")
            }
        }).then((res) => {
            console.log(res);
            get_pending_status()
        }).catch((err) => {
            console.log(err);
        })
        setLoading(false);
    }

    useEffect(() => {
        adjust_N();
        window.addEventListener('resize', adjust_N);

        if (localStorage.getItem("ACM_SIST_TOKEN") == null) {
            location.href = "/admin/login"
        }
        get_pending_status()

        return () => {
            window.removeEventListener('resize', adjust_N);
        }
    }, [])
    

    return (
    <div>
        <AdminNavBar />
        <h1 className='tw-text-center tw-text-2xl tw-text-sky-400 tw-font-semibold'>Pending Verification</h1>
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
                            <CardFooter className='tw-space-x-4'>
                                <Button disabled={Loading} className='tw-w-full' onClick={() => send_payment_status(value, "verified")}>Approve</Button>
                                <Button disabled={Loading} className='tw-w-full' onClick={() => send_payment_status(value, "rejected")} variant={'destructive'}>Reject</Button>
                            </CardFooter>
                        </Card>
                    ))
                )
            }
        </div>
    </div>
  )
}

export default AdminDashboard