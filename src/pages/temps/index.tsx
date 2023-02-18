import React, {useEffect, useState} from 'react'
import { Temporal } from '@js-temporal/polyfill'
import { 
    useQuery, 
    useQueryClient,
    QueryClient,
    QueryClientProvider 
    } from '@tanstack/react-query'
import DayComponent from '@/components/DayComponent'
import MenuBar from '@/components/MenuBar'
import { Menu, Switch } from '@headlessui/react'



    interface dailyWeatherData {
        findIndex(arg0: (e: any) => boolean): unknown
        date: string, 
        maxTemp: number,
        minTemp: number, 
        sunrise: string,
        sunset: string,
        conditions: string,
        description: string,
        hasKnitted: boolean
      }
      

    export default function Index(){
    const [useMinTemp, setUseMinTemp]= useState(false);  
    const [data,setData]=useState([]);
    const [localData,setLocalData]=useState(['initialValue'])
    const [isLoading, setIsLoading]=useState(true)

    function buildData(data:any){
      
      const builtData=data.days.map((day:any)=>{
        return {date: day.datetime, maxTemp: day.tempmax, minTemp: day.tempmin, hasKnitted: false, sunrise: day.sunrise, sunset: day.sunset}
      }).reverse();
      localStorage.setItem ('localWeather', JSON.stringify (builtData))
      setData(builtData)
      setIsLoading (false);
    }

    function combineData(localData: Array<dailyWeatherData>, apiData:any){
      const {days:newDays}=apiData;
      const reducedDays=localData.reduce((newArray: Array<dailyWeatherData>, current: Array<dailyWeatherData>)=>{
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
        const indexFromReducedDays: number= reducedDays.findIndex(e=>e.date===current.datetime);
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
      const finalData: Array<dailyWeatherData>= [...reducedDays, ...reducedNewDays].sort((a,b)=>{
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
     
      const today=Temporal.Now.plainDate('iso8601').toString();
      if (localData[0]!== 'initialValue'){
        if (localData[0]==='emptyLocal'){ 
          fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/45140/2023-01-01/${today}?unitGroup=us&include=days&key=JNR4L23H3DBWFRKM9Q4GSPCAJ&contentType=json`)
          .then((resp)=>resp.json())
          .then((apiData)=>{
            buildData(apiData)
          })
        }
        else {

          const startDate= Temporal.PlainDate.from(localData[0].date)
          const stringStartDate= startDate.subtract({days:1}).toString();
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
        <MenuBar />
        <div>Use Min Temp</div>
        <Switch
            checked={useMinTemp}
            onChange={()=>{
              
              setUseMinTemp(!useMinTemp)
              
              
              console.log("🚀 ~ file: index.tsx:146 ~ Index ~ useMinTemp", useMinTemp)}
            } 
              className={`${
                useMinTemp ? 'bg-slate-800' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
           
            <span
           className={`${
            useMinTemp ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
        </Switch>
        <div className='relative'>        
          {data.map((day, index)=>(
            <DayComponent temp={useMinTemp ? day.minTemp : day.maxTemp} day={day.date} key={index} index={index} hasKnitted={day.hasKnitted} updateData={updateData}/>
        ))}
        </div>
      </div>

    )}