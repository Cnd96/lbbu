import React, { useContext } from 'react';
import VsInputSheetContext from './context/vsInputSheetContext'
const Header = (props) => {
  const vsInputSheetContext=useContext(VsInputSheetContext)
  return(
    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand" style={{marginLeft:'3vw',color:'#FC9BC2'}}>VS Input Sheet</a>
      <div className='options'>
         <select className="form-control"  value={vsInputSheetContext.selectedDivision} 
          onChange={(event)=>vsInputSheetContext.changeSelectedDivision(event.target.value)}
         style={{width:'10vw',marginRight:"30px",color:"#FC9BC2",
         backgroundColor:"#353942",border:"1px solid #FC9BC2"}}>
              {vsInputSheetContext.divisions.map((division)=><option key={division.id} value={division.id} >{division.name}</option>)}
         </select>
    </div>
   </nav>
  );
}
export default Header;