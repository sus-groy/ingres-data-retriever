const url = "https://ingres.iith.ac.in/api/gec/getParentChildLoc";

export async function getDistrictUIDs(stateUID, assessmentYear="2024-2025") {   //starting and beginning assessment years as parameters
    const payload = {
        "aY": assessmentYear,
        "cType": "DISTRICT",
        "pType": "STATE",
        "st": [stateUID],
        "view": "admin"
    }//st = list containing state uuids

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
        let json = await response.json();  //returns json of all districts
        return (json[stateUID] || []).map((district => district.uuid)) // the part after '||' will not throw error if the stateUID is wrong
    }
}