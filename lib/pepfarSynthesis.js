"use strict"

const debug = (msg) => {

    if (String(process.env.DEBUG_APP) === 'true') {
        console.log(msg);
    }

}

exports.ps = ({

    classifyLocation: (configs, locationType, serviceDeliveryPoint, accessType, partnerHIVStatus, clientAge, referrer) => {

        let htsSetting = "";
        let htsModality = "";

        let hivStatus = [(String(partnerHIVStatus).trim().match(/positive/i) ? "Partner Positive" : "Any")];

        let typeOfAccess = "";

        if (String(accessType).trim().match(/routine/i)) {

            typeOfAccess = "PITC";

        } else if (String(accessType).trim().match(/ref/i)) {

            typeOfAccess = "FRS/Index";

        } else if (String(accessType).trim().match(/vct/i)) {

            typeOfAccess = "VCT/Other";

        }

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

        let found = false;

        for (let i = 0; i < age.length; i++) {

            const currentAge = age[i];

            for (let j = 0; j < hivStatus.length; j++) {

                const currentHIVStatus = hivStatus[j];

                if (configs && Object.keys(configs).indexOf(locationType) >= 0 && Object.keys(configs[locationType]).indexOf(serviceDeliveryPoint) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint]).indexOf(typeOfAccess) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint][typeOfAccess]).indexOf(currentHIVStatus) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus]).indexOf(currentAge) >= 0) {

                    htsSetting = configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus][currentAge]["HTS Setting"];
                    htsModality = configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus][currentAge]["HTS Modality"];

                    debug("Location Type: " + locationType + "\nService Delivery Point: " + serviceDeliveryPoint + "\nAccess Type: " + typeOfAccess + "\nPartner Status: " + currentHIVStatus + "\nClient Age: " + currentAge + "\n=============\nSetting: " + htsSetting + "\nModality: " + htsModality);

                    found = true;

                    break;

                }

            }

            if (found)
                break;

        }

        if (htsModality.trim().toLowerCase() === 'index' && (clientAge > 13 || String(referrer).trim().toLowerCase() !== 'parent')) {

            htsModality = 'Other PITC';

        } else if (htsModality.trim().toLowerCase() === 'index' && String(referrer).trim().toLowerCase() !== 'spouse/sexual partner' && String(referrer).trim().toLowerCase() !== 'parent') {

            htsModality = 'Other PITC';

        }

        return { htsSetting, htsModality };

    }

})