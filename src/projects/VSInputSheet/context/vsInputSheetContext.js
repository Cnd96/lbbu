import React from 'react'

export default React.createContext({
    divisions:[{name:"Pink",id:1},{name:"Logo",id:2}],
    selectedDivision:1,
    changeSelectedDivision:(divisionId)=>{},
});