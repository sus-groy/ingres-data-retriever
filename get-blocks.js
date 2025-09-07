import { getDistrictUIDs } from "./get-districts.js";
import { getStateUID } from "./get-states.js";

const url = "https://ingres.iith.ac.in/api/gec/getParentChildLoc";

export async function getBlockUIDs(stateUID, assessmentYear="2024-2025") {   //gets all the blocks for a specific STATE

    const districtUIDs = await getDistrictUIDs(stateUID, assessmentYear);
    const payload = {
        "aY":assessmentYear,
        "cType":"BLOCK",
        "pType":"DISTRICT",
        "st": districtUIDs,
        "view":"admin"
    }//st = array containing single element which is the district UUID
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        throw new Error("FAILED TO GET LIST OF DISTRICTS: Status = " + response.status + ", Status text = " + response.statusText);
    }
    else {
        let blockUIDs = [];
        let json = await response.json(); 
        for(let districtUID of districtUIDs){
            const blocks = (json[districtUID] || []).map(block => block.uuid); // the part after '||' will not throw error if the stateUID is wrong;
            blockUIDs.push(...blocks);
        } 
        return blockUIDs;
    }
}


