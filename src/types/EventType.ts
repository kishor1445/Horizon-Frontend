export type EventType = {
    _id: string,
    name: string,
    type: string,
    seat: number,
    max_seat: number,
    description: string,
    start: Date,
    end: Date,
    fee: number,
    venue: string,
    image_url: string,
    whatsapp_group_link: string,
    round_details: string[],
    rules: string[],
    special_note: string[],
    organizers: string[],
    contact_number: string[]
}