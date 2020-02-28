import React, { } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const DropDownComponent =props=> {
  
  return(
    //  <FormControl   variant="outlined" className="form form-control" style={{}}>
    //         <InputLabel htmlFor="outlined-age-native-simple">
    //           {props.fieldName}
    //         </InputLabel>
    //         <Select
    //           native
    //           value={props.selectedField}
    //           onChange={(e)=>{props.onSelectChange(e.target.value);}}
    //           inputProps={{
    //             name: 'age',
    //             id: 'outlined-age-native-simple',
    //           }}
    //         >
    //           <option value="" />
    //           {props.data.map(({id,name}) =>
    //              <option value={id} key={id}>{name}</option>
    //             )}
    //         </Select>
    // </FormControl> 
    <select className="form-control form-control-sm"
      value={props.selectedField}
      onChange={(e)=>{props.onSelectChange(e.target.value);}}
      >
       <option value="" defaultValue disabled>{props.fieldName}</option>
        {props.data.map(({id,name}) =>
          <option value={id} key={id}>{name}</option>
        )}
    </select>
  )
};


export default DropDownComponent;












