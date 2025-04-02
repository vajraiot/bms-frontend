import { Box } from '@mui/material';
import React from 'react';
import TemperatureG from "./TemperatureG.jsx";
import VoltageG from "./VoltageG";
import SpecificGravityG from './SpecificGravityG.jsx';


const VoltageBarChart = ({ data }) => {

  return (
   <Box marginBottom="10px" display="flex" flexDirection="column" justifyContent="center" alignContent="center">
    <VoltageG data={data}/>
    <TemperatureG data={data}/>
    <SpecificGravityG data={data}/>
   </Box>
  );
};

export default VoltageBarChart;



