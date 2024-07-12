import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EventType } from '@/types/EventType'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Plus } from 'lucide-react'
import { format } from "date-fns"
import client from '@/lib/axios_utils'

type EventProps = {
    data?: EventType
}

const Event: React.FC<EventProps> = ({ data }) => {
    const [Name, setName] = useState('');
    const [eventType, setEventType] = useState('');
    const [Description, setDescription] = useState('');
    const [RoundDetails, setRoundDetails] = useState<string[]>([]);
    const [RoundDetail, setRoundDetail] = useState<string>('');
    const [NumRound, setNumRound] = useState<number>(1);
    const [imageURL, setImageURL] = useState('');
    const [whatsappGroupLink, setWhatsappGroupLink] = useState('');
    const [venue, setVenue] = useState('');
    const [maxSeat, setMaxSeat] = useState('');
    const [fee, setFee] = useState('');
    const [Rules, setRules] = useState<string[]>([]);
    const [Rule, setRule] = useState('');
    const [NumRule, setNumRule] = useState<number>(1);
    const [SpecialNotes, setSpecialNotes] = useState<string[]>([]);
    const [SpecialNote, setSpecialNote] = useState('')
    const [StartDate, setStartDate] = React.useState<Date>()
    const [start_hour, setStartHour] = useState('');
    const [start_minute, setStartMinute] = useState('');
    const [EndDate, setEndDate] = React.useState<Date>()
    const [end_hour, setEndHour] = useState('');
    const [end_minute, setEndMinute] = useState('');
    const [Organizers, setOrganizers] = useState<string[]>([]);
    const [Organizer, setOrganizer] = useState('');
    const [ContactNumbers, setContactNumbers] = useState<string[]>([]);
    const [ContactNumber, setContactNumber] = useState('')
    const [Loading, setLoading] = useState(false);

    const submitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        await client.post("/admin/events", {
            name: Name,
            type: eventType,
            max_seat: maxSeat,
            description: Description,
            start: new Date(StartDate?.getFullYear()!, StartDate?.getMonth()!, StartDate?.getDate(), Number(start_hour), Number(start_minute)),
            end: new Date(EndDate?.getFullYear()!, EndDate?.getMonth()!, EndDate?.getDate(), Number(end_hour), Number(end_minute)),
            fee: fee,
            venue: venue,
            image_url: imageURL,
            whatsapp_group_link: whatsappGroupLink,
            round_details: RoundDetails,
            rules: Rules,
            special_note: SpecialNotes,
            organizers: Organizers,
            contact_number: ContactNumbers
        }, {
            "headers": {
                "Authorization": "Bearer " + localStorage.getItem("ACM_SIST_TOKEN")
            },
            "method": "POST"
        })
        setLoading(false)
    }

    const add_round_details = () => {
        if (RoundDetail === '') {
            return alert("Round Detail can not be empty!")
        }
        setNumRound(NumRound + 1);
        let new_round_detail = RoundDetails;
        new_round_detail.push(RoundDetail);
        setRoundDetails(new_round_detail);
        setRoundDetail('');
    }

    const remove_round_detail = (index: number) => {
        let new_round_details = RoundDetails.filter((_, i) => i !== index)
        setRoundDetails(new_round_details)
        setNumRound(NumRound - 1)
    }

    const add_rule = () => {
        if (Rule === '') {
            return alert("Rules can not be empty!")
        }
        let new_rules = Rules;
        new_rules.push(Rule);
        setRules(new_rules)
        setRule('')
        setNumRule(NumRule + 1)
    }

    const remove_rule = (index: number) => {
        let new_rules = Rules.filter((_, i) => i !== index)
        setRules(new_rules)
        setNumRule(NumRule - 1)
    }

    const add_special_note = () => {
        if (SpecialNote === '') {
            return alert("Special Note can not be empty!")
        }
        let new_special_notes = SpecialNotes;
        new_special_notes.push(SpecialNote);
        setSpecialNotes(new_special_notes)
        setSpecialNote('')
    }

    const remove_special_note = (index: number) => {
        let new_special_notes = SpecialNotes.filter((_, i) => i !== index)
        setSpecialNotes(new_special_notes)
    }

    const addOrg = () => {
        if (Organizer === '') {
            return alert("Organizer name is required")
        } else if (ContactNumber === '') {
            return alert("Contact Number is required")
        }
        let new_data_org = Organizers;
        let new_data_cont = ContactNumbers;
        new_data_org.push(Organizer);
        new_data_cont.push(ContactNumber);
        setOrganizers(new_data_org)
        setContactNumbers(new_data_cont)
        setOrganizer('')
        setContactNumber('')
    }

    const remove_organizer = (index: number) => {
        let new_data_org = Organizers.filter((_, i) => i !== index)
        let new_data_cont = ContactNumbers.filter((_, i) => i !== index)
        setOrganizers(new_data_org)
        setContactNumbers(new_data_cont)
    }

  return (
    <ScrollArea className='tw-h-[80vh]'>
        <form className='tw-mt-4 tw-space-y-8 tw-m-4' onSubmit={submitEvent}>
            <div className='tw-flex  tw-items-center'>
                <Label htmlFor='name' className='tw-w-28 tw-text-primary tw-font-semibold'>Event Name</Label>
                <Input disabled={Loading} name="name" className='tw-ml-4' placeholder='Enter Event Name' value={Name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='tw-flex tw-items-center'>
                <Label htmlFor='event_type' className='tw-w-28 tw-text-primary tw-font-semibold'>Event Type</Label>
                <Select disabled={Loading} name='event_type' onValueChange={(e) => setEventType(e)}>
                    <SelectTrigger className="tw-ml-4 w-[180px]">
                        <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="non_technical">Non Technical</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='tw-flex'>
                <Label htmlFor='description' className='tw-w-28 tw-text-primary tw-font-semibold'>Description</Label>
                <Textarea disabled={Loading} name='description' className='tw-ml-4' value={Description} onChange={(e) => setDescription(e.target.value)} placeholder='Description About The Event' />
            </div>
            <div>
                <Label htmlFor='round_details' className='tw-w-28 tw-text-primary tw-font-semibold'>Round Details</Label>
                {
                    RoundDetails.map((value, index) => (
                        <div className='tw-flex tw-space-x-2 tw-ml-5'>
                            <p className='tw-text-yellow-400 tw-font-semibold'>Round {index + 1}:</p>
                            <p className='tw-whitespace-break-spaces' key={index}>{value}</p>
                            <Button disabled={Loading} type='button' onClick={() => remove_round_detail(index)} variant='destructive' className='tw-w-4 tw-h-4'><p className='tw-scale-75'>X</p></Button>
                        </div>
                    ))
                }
                <div className='tw-flex tw-flex-col tw-mt-2'>
                    <Textarea disabled={Loading} name='round_details' value={RoundDetail} onChange={(e) => setRoundDetail(e.target.value)} placeholder='Details about the individual rounds'/>
                    <Button disabled={Loading} type='button' className='tw-mt-2' onClick={add_round_details}>
                        Add Round {NumRound} Details
                    </Button>
                </div>
            </div>
            <div>
                <Label htmlFor='rules' className='tw-w-28 tw-text-primary tw-font-semibold'>Rules</Label>
                {
                    Rules.map((value, index) => (
                        <div className='tw-flex tw-space-x-2 tw-ml-5'>
                            <p className='tw-text-yellow-400 tw-font-semibold'>Rule {index + 1}:</p>
                            <p className='tw-whitespace-break-spaces' key={index}>{value}</p>
                            <Button disabled={Loading} type='button' onClick={() => remove_rule(index)} variant='destructive' className='tw-w-4 tw-h-4'><p className='tw-scale-75'>X</p></Button>
                        </div>
                    ))
                }
                <div className='tw-flex tw-flex-col tw-mt-2'>
                    <Textarea disabled={Loading} name='rules' value={Rule} onChange={(e) => setRule(e.target.value)} placeholder='Rules for the event?'/>
                    <Button disabled={Loading} type='button' className='tw-mt-2' onClick={add_rule}>
                        Add Rule {NumRule}
                    </Button>
                </div>
            </div>
            <div>
                <Label htmlFor='special_notes' className='tw-w-28 tw-text-primary tw-font-semibold'>Special Notes</Label>
                {
                    SpecialNotes.map((value, index) => (
                        <div className='tw-flex tw-space-x-2 tw-ml-5'>
                            <p className='tw-text-yellow-400 tw-font-semibold'>Special Note {index + 1}:</p>
                            <p className='tw-whitespace-break-spaces' key={index}>{value}</p>
                            <Button disabled={Loading} type='button' onClick={() => remove_special_note(index)} variant='destructive' className='tw-w-4 tw-h-4'><p className='tw-scale-75'>X</p></Button>
                        </div>
                    ))
                }
                <div className='tw-flex tw-flex-col tw-mt-2'>
                    <Textarea disabled={Loading} name='special_notes' value={SpecialNote} onChange={(e) => setSpecialNote(e.target.value)} placeholder='Special Notes for the event?'/>
                    <Button disabled={Loading} type='button' className='tw-mt-2' onClick={add_special_note}>
                        Add Special Note
                    </Button>
                </div>
            </div>
            <div className='tw-flex tw-items-center'>
                <Label htmlFor='event_start' className='tw-text-primary tw-font-semibold tw-w-28'>Start</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                          disabled={Loading}
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !StartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {StartDate ? <span className='tw-whitespace-pre'> {format(StartDate, "PPP")}</span> : <span className='tw-whitespace-pre'> Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={StartDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <div className='tw-flex tw-ml-2 tw-items-center tw-justify-center tw-space-x-2'>
                    <Select disabled={Loading} name='start_hour' onValueChange={(e) => setStartHour(e)}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="HH" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                [...Array(24)].map((_, index) => (
                                    <SelectItem key={index} value={String(index)}>{index}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <p className='tw-scale-150 tw-font-semibold'>:</p>
                    <Select disabled={Loading} name='start_minute' onValueChange={(e) => setStartMinute(e)}>
                        <SelectTrigger>
                            <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ['00', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']
                                    .map((value, index) => (
                                    <SelectItem key={index} value={value}>{value}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='tw-flex tw-items-center'>
                <Label htmlFor='event_end' className='tw-text-primary tw-font-semibold tw-w-28'>End</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button 
                          disabled={Loading}
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !EndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {EndDate ? <span className='tw-whitespace-pre'> {format(EndDate, "PPP")}</span> : <span className='tw-whitespace-pre'> Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={EndDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <div className='tw-flex tw-ml-2 tw-items-center tw-justify-center tw-space-x-2'>
                    <Select disabled={Loading} name='end_hour' onValueChange={(e) => setEndHour(e)}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="HH" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                [...Array(24)].map((_, index) => (
                                    <SelectItem key={index} value={String(index)}>{index}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <p className='tw-scale-150 tw-font-semibold'>:</p>
                    <Select disabled={Loading} name='end_minute' onValueChange={(e) => setEndMinute(e)}>
                        <SelectTrigger>
                            <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ['00', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']
                                    .map((value, index) => (
                                    <SelectItem key={index} value={value}>{value}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='tw-flex tw-items-center'>
                <Label htmlFor='image_url' className='tw-w-28 tw-text-primary tw-font-semibold'>Image URL</Label>
                <Input disabled={Loading} name='image_url' className='tw-ml-4' placeholder='Thumbnail Image For The Event' value={imageURL} onChange={(e) => setImageURL(e.target.value)}/>
            </div>
            <div className='tw-flex tw-items-center'>
                <Label htmlFor='whatsapp_group_link' className='tw-w-28 tw-text-primary tw-font-semibold'>WhatsApp Group Link</Label>
                <Input disabled={Loading} name='whatsapp_group_link' className='tw-ml-4' placeholder='WhatsApp Link For This Event' value={whatsappGroupLink} onChange={(e) => setWhatsappGroupLink(e.target.value)}/>
            </div>
            <div className='tw-flex tw-items-center'>
                <Label htmlFor='venue' className='tw-w-28 tw-text-primary tw-font-semibold'>Venue</Label>
                <Input disabled={Loading} name='venue' className='tw-ml-4' placeholder='Venue Of The Event' value={venue} onChange={(e) => setVenue(e.target.value)}/>
            </div>
            <div className='tw-flex tw-items-center'>
                <Label htmlFor='max_seat' className='tw-w-28 tw-text-primary tw-font-semibold'>Max Seat</Label>
                <Input disabled={Loading} name='max_seat' className='tw-ml-4' placeholder='Maximum Allotted Seats For This Event' value={maxSeat} onChange={(e) => setMaxSeat(e.target.value)}/>
            </div>
            <div className='tw-flex tw-items-center'>
                <Label htmlFor='fee' className='tw-w-28 tw-text-primary tw-font-semibold'>Fee</Label>
                <Input disabled={Loading} name='fee' className='tw-ml-4' placeholder='Registeration Fee' value={fee} onChange={(e) => setFee(e.target.value)}/>
            </div>
            <div>
                <Label htmlFor='organizers' className='tw-w-28 tw-text-primary tw-font-semibold'>Organizers</Label>
                {
                    Organizers.map((value, index) => (
                        <div className='tw-flex tw-space-x-2 tw-ml-5'>
                            <p className='tw-whitespace-pre' key={index}>{value} ({ContactNumbers[index]})</p>
                            <Button disabled={Loading} type='button' onClick={() => remove_organizer(index)} variant='destructive' className='tw-w-4 tw-h-4'><p className='tw-scale-75'>X</p></Button>
                        </div>
                    ))
                }
                <div className='tw-flex tw-mt-2 tw-space-x-2'>
                    <Input disabled={Loading} name='organizers_name' value={Organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder='Name'/>
                    <Input disabled={Loading} name='organizers_contact' value={ContactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder='Contact Number'/>
                    <Button disabled={Loading} type='button' onClick={addOrg}>
                        <Plus />
                    </Button>
                </div>
            </div>
            <Button disabled={Loading} type='submit' className='tw-w-full' >Submit</Button>
        </form>
    </ScrollArea>
  )
}

export default Event