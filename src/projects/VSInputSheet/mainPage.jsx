import React, { useState } from 'react';
import Header from './header'
import VSInputSheetContext from './context/vsInputSheetContext';
import LogoComponent from "./LogoComponent";
const MainPage =props=> {
  const  divisions=[{name:"Pink",id:2},{name:"Logo",id:1}];
  const [selectedDivision,setSelectedDivision]=useState(1);
  const changeSelectedDivision=(divisionId)=>{
    console.log(divisionId)
    setSelectedDivision(divisionId)
  }

  return(
    <VSInputSheetContext.Provider value={{divisions,selectedDivision,changeSelectedDivision}}>
        <Header />
        {selectedDivision==1 ?
        <LogoComponent /> :<h1>def</h1>
        }
    
    </VSInputSheetContext.Provider>
  )
};


export default MainPage;















