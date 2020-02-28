import React, { useState } from 'react';

const PinkComponent =props=> {
  return(
    <div className="container">
        <h2>Pink</h2>
    </div>
  )
};

const SheetJSFT = ["xlsx", "xlsb", "xlsm", "xls"].map(function(x) { return "." + x; }).join(",");

export default PinkComponent;












