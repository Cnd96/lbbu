import React, { useState, useEffect } from 'react';
import XLSX from 'xlsx';
import otrHeaderNames from './Services/otrHeaderNames';
import {wareHouses,deliveryMethods,destinations,packMethods,buyerDivisions,productGroups} from "./Services/logoData.js"
import DropDownComponent from './dropdownComponent';
import {wscols} from './inputSheetTemplate';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
const LogoComponent =props=> {
  const [filename,setFileName]=useState("Select OTR File");
  const [isOtrUploaded,setIsOtrUploaded]=useState(false);
  const [isOtrReading,setisOtrReading]=useState(false);
  const [selectedWareHouse,setSelectedWarehouse]=useState("");
  const [selectedDestination,setSelectedDestination]=useState("");
  const [selectedDeliveryMethod,setSelectedDeliveryMethod]=useState("");
  const [selectedPackMethod,setSelectedPackMethod]=useState("");
  const [selectedBuyerDivision,setSelectedBuyerDivision]=useState("");
  const [selectedProductGroup,setSelectedProductGroup]=useState("");
  const [stylesData,setStylesData]=useState([]);
  const [showStyles,setShowStyles]=useState(false);
  const [merchandiser,setMerchandiser]=useState("");
  const [planner,setPlanner]=useState("");
  useEffect(() => {
      if(selectedDeliveryMethod!=""&&selectedWareHouse!=""&&selectedDestination!=""&&selectedPackMethod!=""){
        setShowStyles(true)
      }
    },
    [selectedWareHouse, selectedDestination,selectedDeliveryMethod,selectedPackMethod]
  );
  const onOtrFileSelect=async (e)=>{
    let uniqueStylesWithData=[];
    const files = e.target.files;
    await setisOtrReading(true);
    await setFileName(files[0].name);
    await setIsOtrUploaded(false);
    const reader = new FileReader();
	  const rABS = !!reader.readAsBinaryString;
  	reader.onload = async(e) => {
        const bstr = e.target.result;
        const wb =await XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
        const sheet = wb.Sheets['OTR'];
        if(sheet){
          let sheetStyles=[];
          const sheetData = XLSX.utils.sheet_to_json(sheet, {
            header:1,
            // cellDates:false,
            // range: 0,
            blankrows: false,
            defval: '',
          });
          const headerRow=sheetData.splice(0,1)[0]
          for(let i in headerRow){
            headerRow[i]=headerRow[i].trim()
          }
          sheetData.forEach(line=>{ 
            let obj={};
            for(let i in headerRow){
                obj[headerRow[i]]=line[i];
            }
            sheetStyles.push(obj)
          });
          //Extracting Not Null Styles
          const sheetStylesNumbers=sheetStyles.filter(l=>l[otrHeaderNames.MovexStyle]).map(l=>l[otrHeaderNames.MovexStyle])
          const uniqueStyles=[...new Set([...sheetStylesNumbers])];
          uniqueStyles.forEach(style=>{
            const stylesData=sheetStyles.filter(l=>l[otrHeaderNames.MovexStyle]==style);
            uniqueStylesWithData.push({styleNo:style,lines:stylesData,wareHouse:"",destination:"",deliveryMethod:"",
            merchandiser:"",planner:"",packMethod:"",productGroup:"",buyerDivision:"",added:false})
          })
          setStylesData(uniqueStylesWithData);
          setIsOtrUploaded(true);
          setisOtrReading(false);
        }else{
          alert("No OTR Sheet")
          setisOtrReading(false);
        }
	  };
  	if(rABS) reader.readAsBinaryString(files[0]); else reader.readAsArrayBuffer(files[0]);
  }
  const onWareHouseChange=(id)=>{
    setSelectedWarehouse(id);
  }
  const onDestinationChange=(id)=>{
    setSelectedDestination(id)
  }
  const onDeliveryMethodChange=(id)=>{
    setSelectedDeliveryMethod(id)
  }
  const onPackMethodChange=(id)=>{
    setSelectedPackMethod(id)
  }
  const onBuyerDivisionChange=(id)=>{
    setSelectedBuyerDivision(id)
  }
  const onProductGroupChange=(id)=>{
    setSelectedProductGroup(id)
  }
  const onInputSheetDownload=()=>{
    const wb = XLSX.utils.book_new();
    const addedStyles=stylesData.filter(data=>data.added==true);
    addedStyles.forEach(style=>{
      let template =[
        ['Style Number',style.styleNo],
        ['RM item Group',''],
        ['GMT item Group',''],
        ['Garment Item Description',''],
        ['Lead Factory',''],
        ['Buyer',''],
        ['Buyer Division',style.buyerDivision],
        ['Season',''],
        ['Product Group',style.productGroup],
        ['Merchandiser',style.merchandiser],
        ['Planner',style.planner],
        ['Garment Fabric Composition',''],
        ['Version ID',''],
        ['Style Categorization',''],
        ['Group Tech Class',''],
        ['Reff Id',''],
        ['Product Line ',''],
        ['Range',''],
        ['Work-study Catagorization',''],
        [],
        ["Production Warehouse","Destination","Requested Delivery Date - Customer","Planned Delivery Date - Planner",
         "FOB Date"," NDC Date","PCD Date","Customer StyleNo","Color","VPO No","CPO No","Sales Price","Cash Discount",
         "Delivery Method","Delivery Term","Pack Method","Z FTR","Total Quantity","XS","S","M","L","XL","XXL",
         "CO Number","PO Type","Hierarchy ID","PCD Validation","Delivery Date Validation","Packing BOM"]
      ];
      style.lines.forEach(line=>{
        const requestedXFTYDate=convertExcelDateToJsLocaleDateString(line[otrHeaderNames.RequestedXFTY])
        const customerStyleNo=line[otrHeaderNames.GenericArticleNo].toString()+line[otrHeaderNames.FlexProtoNo].toString();
        // console.log(line)
        const rowToAdd=[style.wareHouse,style.destination,requestedXFTYDate,requestedXFTYDate,,,,
          customerStyleNo,line[otrHeaderNames.Color],line[otrHeaderNames.VPONo],line[otrHeaderNames.SOCPONo],,,style.deliveryMethod,,style.packMethod,
          line[otrHeaderNames.Zfeqture],line[otrHeaderNames.Qty],line[otrHeaderNames.XS],line[otrHeaderNames.S],line[otrHeaderNames.M],
          line[otrHeaderNames.L],line[otrHeaderNames.XL]
        ]
        template.push(rowToAdd)
      })
      const ws = XLSX.utils.aoa_to_sheet(template);
      ws['!cols'] = wscols;
      XLSX.utils.book_append_sheet(wb, ws, style.styleNo);
    })
  
    XLSX.writeFile(wb, "Logo.xlsx");
  }
  const convertExcelDateToJsLocaleDateString=(dateSerialNumber)=>{
    const utc_days  = Math.floor(dateSerialNumber - 25569);
    const utc_value = utc_days * 86400;                                        
    return new Date(utc_value * 1000).toLocaleDateString();
  }
  const addStyleButtonClicked=(styleNo)=>{
    const wareHouse=wareHouses.find(w=>w.id==selectedWareHouse);
    const destination=destinations.find(d=>d.id==selectedDestination);
    const deliverymethod=deliveryMethods.find(del=>del.id==selectedDeliveryMethod);
    const packmethod=packMethods.find(pack=>pack.id==selectedPackMethod);
    const buyerDivision=buyerDivisions.find(buy=>buy.id==selectedBuyerDivision);
    const productGroup=productGroups.find(prod=>prod.id==selectedProductGroup);
    const tempStylesData=[...stylesData];
    const addedStyle=tempStylesData.find(data=>data.styleNo==styleNo);
    if(addedStyle){
      addedStyle.wareHouse=wareHouse.name;
      addedStyle.destination=destination.name;
      addedStyle.deliveryMethod=deliverymethod.name;
      addedStyle.packMethod=packmethod.name;
      addedStyle.merchandiser=merchandiser;
      addedStyle.planner=planner;
      addedStyle.buyerDivision=buyerDivision?buyerDivision.name:"";
      addedStyle.productGroup=productGroup?productGroup.name:"";
      addedStyle.added=true;
      setStylesData(tempStylesData)
    }
  //  console.log(wareHouse.name)
  }
  return(
    <div className="container">
      <Grid container spacing={1} style={{marginTop:"2vw"}}>
        <Grid item xs={3}>
        <label className="form-control"style={{width:"20vw",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}} >  
            {filename}
            <input type="file"   style={{display:"none"}}   name={filename}  accept={SheetJSFT} onChange={onOtrFileSelect}/>
        </label>
        </Grid>
        <Grid item xs={3}>
         <div className="spinner-border text-primary"  hidden={!isOtrReading}>
          <span className="sr-only">Loading...</span>
        </div>
        <button className="btn btn-primary" hidden={!showStyles} onClick={onInputSheetDownload}>Download</button>
        </Grid>
      </Grid>
        
        {isOtrUploaded? 
        <div style={{marginTop:"2vw"}} className="container">
          <div className="row">
            <div className="col-sm-6">
            <Grid container  style={{border:"0.4px solid #C0C0C0	",padding:"0.7vw",borderRadius:"5px"}}spacing={3}>
                <Grid item xs={6}>
                  <DropDownComponent fieldName="Delivery Method" data={deliveryMethods} onSelectChange={onDeliveryMethodChange} selectedField={selectedDeliveryMethod}/>
                </Grid>
                <Grid item xs={6}>
                  <DropDownComponent fieldName="Ware House" data={wareHouses} onSelectChange={onWareHouseChange} selectedField={selectedWareHouse}/>
                </Grid>
                <Grid item xs={6}>
                  <DropDownComponent fieldName="Pack Method" data={packMethods} onSelectChange={onPackMethodChange} selectedField={selectedPackMethod}/>
                </Grid>
                <Grid item xs={6}>
                  <DropDownComponent fieldName="Destination" data={destinations} onSelectChange={onDestinationChange} selectedField={selectedDestination}/>
                </Grid>
              </Grid>
            </div>
            <div className="col-sm-6">
            <Grid container style={{border:"0.4px solid #C0C0C0	",padding:"0.7vw",borderRadius:"5px"}}spacing={3}>
                <Grid item xs={6}>
                 <input className="form-control input-sm" value={merchandiser} onChange={(e)=>setMerchandiser(e.target.value)} style={{height:"2.4vw"}} placeholder="Merchandiser" type="text" />
                </Grid>
                <Grid item xs={6}>
                 <input className="form-control input-sm" value={planner} onChange={(e)=>setPlanner(e.target.value)}  style={{height:"2.4vw"}} placeholder="Planner" type="text" />
                </Grid>
                <Grid item xs={6}>
                  <DropDownComponent fieldName="Buyer Divisions" data={buyerDivisions} onSelectChange={onBuyerDivisionChange} selectedField={selectedBuyerDivision}/>
                </Grid>
                <Grid item xs={6}>
                  <DropDownComponent fieldName="Product Group" data={productGroups} onSelectChange={onProductGroupChange} selectedField={selectedProductGroup}/>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        :<h2></h2>}

        {showStyles?
        <div style={{marginTop:"2vw"}}>
          <font size="2" face="century gothic" >
          <table  className="table table-bordered table-sm">
           <thead>
            <tr>
              <th scope="col">Style</th>
              <th scope="col"></th>
              <th scope="col">Warehouse</th>
              <th scope="col">Destination</th>
              <th scope="col">Delivery Method</th>
              <th scope="col">Pack Method</th>
              <th scope="col">Merchandiser</th>
              <th scope="col">Planner</th>
              <th scope="col">Buyer Division</th>
              <th scope="col">Product Group</th>
            </tr>
          </thead>
        <tbody>
          {stylesData.map(({styleNo,wareHouse,destination,deliveryMethod,packMethod,merchandiser,planner,buyerDivision,productGroup}) =>
            <tr key={styleNo}style={{paddingTop:"0vw"}} >
              <td style={{paddingRight:"0vw"}}>{styleNo}</td>
              {/* <td> <button className="btn btn-success btn-sm" onClick={()=>addStyleButtonClicked(styleNo)} >ADD</button></td> */}
              <td align="center"><AddCircleIcon  color="secondary"  onClick={()=>addStyleButtonClicked(styleNo)}/></td>
              <td>{wareHouse} </td>
              <td>{destination} </td>
              <td>{deliveryMethod} </td>
              <td> {packMethod}</td>
              <td> {merchandiser}</td>
              <td> {planner}</td>
              <td> {buyerDivision}</td>
              <td> {productGroup}</td>
            </tr>
          )}
        </tbody>
        </table>
        </font>
        </div>
        :<h2></h2>}
    </div>
  )
};

const SheetJSFT = ["xlsx", "xlsb", "xlsm", "xls"].map(function(x) { return "." + x; }).join(",");

export default LogoComponent;












