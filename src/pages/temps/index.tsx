import React, {useEffect, useState} from 'react'
import { Temporal } from '@js-temporal/polyfill'
import { 
    useQuery, 
    useQueryClient,
    QueryClient,
    QueryClientProvider 
    } from '@tanstack/react-query'
import GetLocalData from '@/components/DataComponent'
import DayComponent from '@/components/DayComponent'
import { updateDefaultClause } from 'typescript'

    interface dailyWeatherData {
        date: string, 
        maxTemp: number,
        minTemp: number, 
        sunrise: string,
        sunset: string,
        conditions: string,
        description: string,
        hasKnitted: boolean
      }
      
      interface tempsData {
        dayData: dailyWeatherData[]
      }

    export default function Index(){

    const [data,setData]=useState([]);
    const [localData,setLocalData]=useState(['initialValue'])
    const [isLoading, setIsLoading]=useState(true)

    function buildData(data:any){
      
      const builtData=data.days.map((day:any)=>{
        return {date: day.datetime, maxTemp: day.tempmax, minTemp: day.tempmin, hasKnitted: true, sunrise: day.sunrise, sunset: day.sunset}
      }).reverse();
      localStorage.setItem ('localWeather', JSON.stringify (builtData))
      setIsLoading (false);
    }

    function combineData(localData: tempsData, apiData:object){
      const {days:newDays}=apiData;
      //console.log(newDays)
      const reducedDays=localData.reduce((newArray, current)=>{
        const indexFromNewDays=newDays.findIndex(e=> e.datetime===current.date)
        if (indexFromNewDays>=0){
          const newDayObject= {
            date: current.date,
            maxTemp: newDays[indexFromNewDays].tempmax,
            minTemp: newDays[indexFromNewDays].tempmin,
            hasKnitted: current.hasKnitted,
            sunrise: newDays[indexFromNewDays].sunrise,
            sunset: newDays[indexFromNewDays].sunset
          }
          return [...newArray, newDayObject]
        }else{
          return [...newArray, current]
        }
      },[])
      
      const reducedNewDays=newDays.reduce((newArray, current)=>{
        const indexFromReducedDays= reducedDays.findIndex(e=>e.date===current.datetime);
        if (indexFromReducedDays<0){
          const newDayObject={
            date: current.datetime,
            maxTemp: current.tempmax,
            minTemp: current.tempmin,
            hasKnitted: false,
            sunrise: current.sunrise,
            sunset: current.sunset,
          }
          return [...newArray, newDayObject]
        }
        return newArray
      },[])
      const finalData= [...reducedDays, ...reducedNewDays].sort((a,b)=>{
        if (a.date < b.date){
          return 1
        }
        if (a.date>b.date){
          return -1
        }
        return 0
      })
      setData(finalData)
      setIsLoading(false)
      localStorage.setItem('localWeather', JSON.stringify(finalData))
    }


    useEffect(()=>{
      const parsedLocalData=JSON.parse(localStorage.getItem('localWeather'))
      if (!parsedLocalData){
        setLocalData(['emptyLocal'])
      }else{
        setLocalData(parsedLocalData)
      }
       
    },[])

    useEffect(()=>{
     
      if (localData[0]!== 'initialValue'){
        if (localData[0]==='emptyLocal'){ 
          fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/45140/2023-01-01/2023-01-26?unitGroup=us&include=days&key=JNR4L23H3DBWFRKM9Q4GSPCAJ&contentType=json')
          .then((resp)=>resp.json())
          .then((apiData)=>{
            buildData(apiData)
          })
        }
        else {
          const today=Temporal.Now.plainDate('iso8601').toString();
          const startDate= Temporal.PlainDate.from(localData[0].date)
          const stringStartDate= startDate.subtract({days:1}).toString();
          console.log(stringStartDate, today)
          fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/45140/${stringStartDate}/${today}?unitGroup=us&include=days&key=JNR4L23H3DBWFRKM9Q4GSPCAJ&contentType=json`)
          .then((resp)=>resp.json()).then((apiData)=>combineData(localData, apiData))
        }
      }
    },[localData])

    function updateData(index:number, hasKnitted: boolean){
      data[index].hasKnitted=hasKnitted;
      localStorage.setItem ('localWeather', JSON.stringify (data))
    }

    if (isLoading){
      return (
        <div>Is Loading...</div>
      )
    }

    return (
      <div>
        {data.map((day, index)=>(
          <DayComponent temp={day.maxTemp} day={day.date} key={index} index={index} hasKnitted={day.hasKnitted} updateData={updateData}/>
        ))}
      </div>

    )}