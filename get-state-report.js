import fs from "fs";
import { getStateUID } from "./get-states.js";
import { getBlockUIDs} from "./get-blocks.js";

const states = [
    'TELANGANA',
    'CHANDIGARH',
    'TAMILNADU',
    'BIHAR',
    'GOA',
    'HARYANA',
    'MAHARASHTRA',
    'JAMMU AND KASHMIR',
    'NAGALAND',
    'MANIPUR',
    'KARNATAKA',
    'PUDUCHERRY',
    'MADHYA PRADESH',
    'JHARKHAND',
    'GUJARAT',
    'SIKKIM',
    'CHHATTISGARH',
    'WEST BENGAL',
    'HIMACHAL PRADESH',
    'ODISHA',
    'TRIPURA',
    'DELHI',
    'DADRA AND NAGAR HAVELI',
    'ANDAMAN AND NICOBAR ISLANDS',
    'MEGHALAYA',
    'LAKSHDWEEP',
    'UTTAR PRADESH',
    'DAMAN AND DIU',
    'ARUNACHAL PRADESH',
    'KERALA',
    'ASSAM',
    'ANDHRA PRADESH',
    'MIZORAM',
    'PUNJAB',
    'LADAKH',
    'RAJASTHAN',
    'UTTARAKHAND',
]

// URL for INGRES report generation
const url = "https://ingres.iith.ac.in/api/gec/prepareReport";
let assessmentYear = '2024-2025';


// to use this, run `node get-state-report.js <state name> <assessment year(optional)>` in terminal

async function downloadBlockReport(stateName) {

  const blockUIDs = await getBlockUIDs(await getStateUID(stateName, assessmentYear), assessmentYear);  
  const payload = {
       "DISTRICT":[],
       "STATE":[],
       "BLOCK":blockUIDs,
       "ay":assessmentYear,
       "calcType":"normal","district":"","pType":"STATE","pu":"ffce954d-24e1-494b-ba7e-0931d8ad6085","state":"","topView":"BLOCK","type":"cntrp","vs":1,"view":"admin"
  }; 
  //^ DISTRICT = list of uuids of districts whose blocks are to be assessed
  //^ STATE is a list of ONE SINGLE ELEMENT which is the state whose blocks are to be assessed
  //^ BLOCK = list of uuids of blocks which are to be assessed
  try {    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`❌ Failed: ${response.status} ${response.statusText}`);
    }

    // The API returns Excel as binary (octet-stream)
    const buffer = await response.arrayBuffer();
    const fileName = `report_${stateName.toLowerCase()}_${Date.now()}.xlsx`;

    fs.writeFileSync(fileName, Buffer.from(buffer));
    console.log(`✅ Report saved as ${fileName}`);
  } catch (err) {
      console.error("Error downloading report:", err.message);
  }
}

if(process.argv.length >= 3){
  downloadBlockReport(process.argv[2]);
  if(process.argv.length > 3) //if assessement year is provided through terminal
      assessmentYear = process.argv[3];
}
else
  console.error("State name must be provided as argument");