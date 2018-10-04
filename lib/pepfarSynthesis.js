"use strict"

const debug = (msg) => {

    if (String(process.env.DEBUG_APP) === 'true') {
        console.log(msg);
    }

}

exports.ps = ({

    classifyLocation: (configs, locationType, serviceDeliveryPoint, accessType, partnerHIVStatus, clientAge, referrer, gender) => {

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

                let genders = [];

                if (String(gender).toUpperCase() === 'M') {

                    genders.push('M');

                } else if (String(gender).toUpperCase() === 'F') {

                    genders.push('F');

                }

                genders.push('Any');

                for (let k = 0; k < genders.length; k++) {

                    let currentGender = genders[k];

                    if (configs && Object.keys(configs).indexOf(locationType) >= 0 && Object.keys(configs[locationType]).indexOf(serviceDeliveryPoint) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint]).indexOf(typeOfAccess) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint][typeOfAccess]).indexOf(currentHIVStatus) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus]).indexOf(currentGender) >= 0 && Object.keys(configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus][currentGender]).indexOf(currentAge) >= 0) {

                        htsSetting = configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus][currentGender][currentAge]["HTS Setting"];
                        htsModality = configs[locationType][serviceDeliveryPoint][typeOfAccess][currentHIVStatus][currentGender][currentAge]["HTS Modality"];

                        debug("\n\nLocation Type: " + locationType + "\nService Delivery Point: " + serviceDeliveryPoint + "\nAccess Type: " + typeOfAccess + "\nPartner Status: " + currentHIVStatus + "\nClient Age: " + currentAge + "\n=============\nSetting: " + htsSetting + "\nModality: " + htsModality + "\nGender: " + gender);

                        found = true;

                        break;

                    }

                }

                if (found)
                    break;

            }

            if (found)
                break;

        }

        debug("\n\nloc: %s\nSDP: '%s'\nacc: %s\nPHIV: %s\nage: %s\nref: %s\nsex: %s\ntacc: %s\nfound: %s", locationType, serviceDeliveryPoint, accessType, partnerHIVStatus, clientAge, referrer, gender, typeOfAccess, found);

        if (htsModality.trim().toLowerCase() === 'index' && (clientAge > 13 || String(referrer).trim().toLowerCase() !== 'parent')) {

            htsModality = 'Other PITC';

        } else if (htsModality.trim().toLowerCase() === 'index' && String(referrer).trim().toLowerCase() !== 'spouse/sexual partner' && String(referrer).trim().toLowerCase() !== 'parent') {

            htsModality = 'Other PITC';

        }

        return { htsSetting, htsModality };

    }

})