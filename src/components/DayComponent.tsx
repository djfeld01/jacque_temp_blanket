import React from 'react'
import { global } from 'styled-jsx/css'

interface DayComponentProps {
  temp: number,
  day: string
}
interface bgColorsType {

}
function DayComponent(props: DayComponentProps) {
  const bgColors: any= {
    '90': 'bg-[#9d0a11] text-gray-300',
    '80': 'bg-[#d26230]',
    '70': 'bg-[#e4c66d]',
    '60': 'bg-[#e0d9bb]',
    '50': 'bg-[#9ca98e]',
    '40': 'bg-[#659fc6]',
    '30': 'bg-[#1868bd] text-gray-200',
    '20': 'bg-[#0a1d39] text-gray-300',
    '10': 'bg-[#735eae] text-gray-300',
  }

  const {temp, day}=props
  
  const formatTemp:number= Math.floor(temp/10) *10;
  
  const tempBG:any=bgColors[formatTemp] + ' flex-grow-0'
  console.log(day, temp, formatTemp)
  const tempText='text-temps-800'

  return (
    <div className={tempBG}>
      
        <div className="flex-grow"> {day} - {temp} degrees</div>
  </div>
  )
   

}

export default DayComponent