import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const Status: React.FC = () => {
  return (
    <Card className='tw-m-2'>
        <CardHeader>
            <CardTitle>
                <Skeleton className='tw-h-4 tw-w-44'/>
            </CardTitle>
            <CardDescription className='tw-space-y-1.5'>
                <Skeleton className='tw-h-4'/>
                <Skeleton className='tw-h-4'/>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Skeleton className='tw-h-72'/>
        </CardContent>
    </Card>
  )
}

export {Status}