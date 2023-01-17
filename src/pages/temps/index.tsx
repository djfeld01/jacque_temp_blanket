import React from 'react'
import DayComponent from '@/components/DayComponent'


function Temps({data}) {
  const {days}=data
  const reversedDays=days.reverse();

  return(
   reversedDays.map((day,index)=>(<DayComponent temp={day.tempmax} day={day.datetime} key={index}/>
   )))
  

} 



export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/45140/yeartodate?unitGroup=us&include=days&key=JNR4L23H3DBWFRKM9Q4GSPCAJ&contentType=json`)
  
  
  const data = await res.json()

  console.log(data)
  // Pass data to the page via props
  
  return { props: { data } }
}

export default Temps;