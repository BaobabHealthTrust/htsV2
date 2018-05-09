"use strict"

const debug = (msg) => {

    if (String(process.env.DEBUG_APP) === 'true') {
        console.log(msg);
    }

}

exports.PepfarSynthesis = ({

    classifyLocation: (configs, locationType, serviceDeliveryPoint, accessType, partnerHIVStatus, clientAge) => {

        let htsSetting = "";
        let htsModality = "";

        let hivStatus = [(String(partnerHIVStatus).trim().match(/positive/i) ? "Partner Positive" : "Any")];

        let typeOfAccess = (String(accessType).trim().match(/routine/i) ? "PITC" : (String(accessType).trim().match(/ref/i) ? "FRS/Index" : (String(accessType).trim().match(/pitc/i) ? "PITC" : "VCT/Other")));

        let age = [];

        if (clientAge < 14) {

            age.push("0-13Y");

        }

        if (clientAge < 5) {

            age.push("0-4Y");

        } else {

            age.push("5Y+")

        }

        age.push("Any");

        if (hivStatus.indexOf("Any") < 0) {

            hivStatus.push("Any");

        }

        if (hivStatus.indexOf("Any other") < 0) {

            hivStatus.push("Any other");

        }

        for (let i = 0; i < age.length; i++) {

            const currentAge = age[i];

            for (let j = 0; j < hivStatus.length; j++) {

                const currentHIVStatus = hivStatus[j];

                if (configs && Object.keys(configs).indexOf(locationType) >= 0 && Object.keys(configs[locationType]).indexOf(serviceDeliveryPoint) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint]).indexOf(typeOfAccess) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint][typeOfAccess]).indexOf(currentHIVStatus) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus]).indexOf(currentAge) >= 0) {

                    htsSetting = configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus][currentAge]["HTS Setting"];
                    htsModality = configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus][currentAge]["HTS Modality"];

                    debug("Location Type: %s\nService Delivery Point: %s\nAccess Type: %s\nPartner Status: %s\nClient Age: %s\n=============\nSetting: %s\nModality: %s", locationType, serviceDeliveryPoint, typeOfAccess, currentHIVStatus, currentAge, htsSetting, htsModality);

                    break;

                }

            }

        }

        return { htsSetting, htsModality };

    }

})