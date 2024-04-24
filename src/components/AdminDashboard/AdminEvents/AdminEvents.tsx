import React, { useState, useEffect } from 'react'
import AdminNavBar from '../AdminNavBar/AdminNavBar'
import { Status } from '../SkeletonCards/SkeletonCards';
import { Button } from '@/components/ui/button';
import { Plus, SquarePen } from 'lucide-react';
import client from '@/lib/axios_utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { EventType } from '@/types/EventType';
import Event from './Event';


const AdminEvents: React.FC = () => {

    const [N, setN] = useState(0);
    const [Loading, setLoading] = useState(true);
    const [Events, setEvents] = useState<EventType[]>([]);

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

    const fetchEvents = async () => {
        await client.get("/events/").then(
            (res) => {
                setEvents(res.data)
                setLoading(false)
            }
        )
    }

    useEffect(() => {
        adjust_N();
        window.addEventListener('resize', adjust_N);

        if (localStorage.getItem("ACM_SIST_TOKEN") == null) {
            location.href = "/admin/login"
        }

        fetchEvents()
        
        return () => {
            window.removeEventListener('resize', adjust_N);
        }
    }, [])

    const view_list = (data: String[]) => {
        return data.map((value, index) => (
            <p key={index} className='tw-pl-5'>{value}</p>
        ))
    }

    const view_list_mix = (data1: String[], data2: String[]) => {
        let new_data = [];
        for (let i = 0; i < data1.length; i++) {
            new_data.push(data1[i] + ' (' + data2[i] + ')');
        }
        return new_data.map((value, index) => (
            <p key={index} className='tw-pl-5'>{value}</p>
        ))
    }

    const delete_event = async (id: string) => {
        if (!localStorage.getItem('ACM_SIST_TOKEN')) {
            location.href = "/admin/login"
            return null
        }
        await client.delete("/admin/events?id=" + id, {
            "headers": {
                "Authorization": "Bearer " + localStorage.getItem("ACM_SIST_TOKEN")
            }
        }).then(
            (res) => {
                console.log(res)
                setLoading(true)
                fetchEvents()
            }
        ).catch(
            (err) => {
                console.log(err)
                alert("Something went wrong")
            }
        )
    }

    return (
        <div>
            <AdminNavBar />
            <div className='tw-flex tw-items-center tw-justify-between tw-mx-4'>
                <h1 className='tw-text-2xl tw-text-sky-400 tw-font-semibold'>Events</h1>
                <Dialog>
                    <DialogTrigger className='tw-flex tw-whitespace-pre tw-text-base' ><Button className='tw-whitespace-pre tw-text-base'><Plus /> New</Button></DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Create New Event</DialogTitle>
                        <DialogDescription className=''>
                            <Event />
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </div>
            <br />
            {
                   Events.length == 0 && Loading == false && <p className='tw-text-red-400 tw-text-2xl tw-flex tw-items-center tw-justify-center'>No Events. Create Event by clicking on the<span className='tw-text-sm tw-text-black tw-bg-primary tw-rounded-sm tw-px-1 tw-py-0 tw-flex tw-items-center tw-justify-center tw-m-2'><Plus className='tw-w-4' /> New</span>button</p> 
            }
            <div className='tw-grid tw-gap-1 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4'>
                {
                    Loading ? (
                        [...Array(N)].map((v) => (
                            <Status key={v} />
                        ))
                    ) : (
                        Events.map((value, index) => (
                            <Card key={index} className='tw-m-2'>
                                <CardHeader>
                                    <CardTitle>
                                        {value.name} | {value.type.replace("_", " ")}
                                    </CardTitle>
                                    <CardDescription>
                                        {value.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <img src={value.image_url} /><br />
                                    <CardDescription>
                                        <b className='tw-text-primary'>Start: </b> {format(value.start, 'MMM do, yyyy @ h:mm a')} <br />
                                        <b className='tw-text-primary'>End: </b> {format(value.end, 'MMM do, yyyy @ h:mm a')} <br />
                                        <b className='tw-text-primary'>Round Details: </b> {view_list(value.round_details)}
                                        <b className='tw-text-primary'>Rules: </b> {view_list(value.rules)}
                                        <b className='tw-text-primary'>Special Notes: </b> {view_list(value.special_note)}
                                        <b className='tw-text-primary'>Fee: </b> {value.fee} <br />
                                        <b className='tw-text-primary'>Venue: </b> {value.venue} <br />
                                        <b className='tw-text-primary'>Seat: </b> {value.seat}/{value.max_seat} <br />
                                        <b className='tw-text-primary'>WhatsApp Group: </b> {value.whatsapp_group_link} <br />
                                        <b className='tw-text-primary'>Organizers: </b> {view_list_mix(value.organizers, value.contact_number)} <br />
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className='tw-space-x-8'>
                                    <Dialog>
                                        <DialogTrigger className='tw-flex tw-whitespace-pre' ><SquarePen /> Edit</DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Edit {value.name}</DialogTitle>
                                            <DialogDescription className=''>
                                                Hello
                                            </DialogDescription>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger className='tw-bg-destructive tw-py-2 tw-px-3 tw-rounded-md hover:tw-opacity-90'>Delete</DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete {value.name}</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to delete {value.name}?<br />
                                                    Deleted event will not be recoverable!
                                                </DialogDescription>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant={"secondary"}>Close</Button>
                                                    </DialogClose>
                                                    <Button variant={'destructive'} onClick={() => delete_event(value._id)}>Yes!</Button>
                                                </DialogFooter>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default AdminEvents