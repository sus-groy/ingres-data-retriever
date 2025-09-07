// URL for INGRES report generation
const url = "https://ingres.iith.ac.in/api/gec/getParentChildLoc";

export async function getStates(assessmentYear = "2024-2025") {   //starting and beginning assessment years as parameters
    const payload = {
        "pType": "COUNTRY",
        "cType": "STATE",
        "ay": assessmentYear,
        "view": "ADMIN"
    };
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("FAILED TO GET LIST OF STATES: Status = " + response.status + ", Status text = " + response.statusText);
    }
    else {
        let statesInfo = await response.json();
        return statesInfo;
    }
}

export async function getStateUID(stateName, assessmentYear) {
    const states = await getStates(assessmentYear);
    for (const [uuid, infoArr] of Object.entries(states)) {
        if (infoArr[0].name.toUpperCase() === stateName.toUpperCase()) {
            return uuid; // or infoArr[0].uuid (same value)
        }
    }
    throw new Error(`State "${stateName}" not found!`);
}
