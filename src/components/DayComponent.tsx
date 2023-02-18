import { Switch } from '@headlessui/react'
import { Temporal } from '@js-temporal/polyfill'
import React, { useEffect, useState } from 'react'
import { global } from 'styled-jsx/css'
import { updateDefaultClause } from 'typescript'

interface DayComponentProps {
  temp: number,
  day: string, 
  index: number, 
  updateData: (arg0:number, arg1:boolean)=>void,
  hasKnitted: boolean
}
interface bgColorsType {

}
function DayComponent(props: DayComponentProps) {
  const bgColors: any= {
    '90': 'bg-[#9d0a11] text-gray-300',    '80': 'bg-[#d26230]',
    '70': 'bg-[#e4c66d]',
    '60': 'bg-[#e0d9bb]',
    '50': 'bg-[#9ca98e]',
    '40': 'bg-[#659fc6]',
    '30': 'bg-[#1868bd] text-gray-200',
    '20': 'bg-[#0a1d39] text-gray-300',
    '10': 'bg-[#735eae] text-gray-300',
  }

  const {temp, day, index, hasKnitted, updateData}=props
  const formattedDate= Temporal.PlainDate.from(day).toLocaleString('en-US', { calendar: 'gregory', year: 'numeric', month: 'long', day: 'numeric' });
  const roundedTemp:number= Math.round(temp)
  const formatTemp:number= Math.floor(roundedTemp/10) *10;
  
  
  const tempBG:any=bgColors[formatTemp]
  
  const [checked, setChecked]=useState(hasKnitted);


  return (
    <div className={tempBG + ' flex flex-row rounded-2xl items-center p-1 m-1 '}>
       

        <div className='mx-3 flex-auto'>{formattedDate}</div>
        <div className='mx-3 flex-auto'>{roundedTemp}°</div>
        <div className='mx-3 flex-auto'>
          <Switch
            checked={checked}
            onChange={()=>{
              updateData(index, !checked)
              setChecked(!checked)
              }} 
              className={`${
                checked ? 'bg-slate-800' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
           
            <span
           className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
        </Switch>
        </div>
    </div>
  )
}

export default DayComponent

