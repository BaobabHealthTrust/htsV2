#!/usr/bin/env node

if (process.argv.indexOf('-f') > 0) {

  const fs = require('fs');

  const file = process.argv[process
    .argv
    .indexOf('-f') + 1];

  if (fs.existsSync(file)) {

    let json = {};

    let mappings = {
      serviceDeliveryPoints: [],
      partnerHIVStatuses: [],
      genders: [],
      clientAges: [],
      htsSettings: [],
      htsModalities: []
    }

    const rows = fs
      .readFileSync(file)
      .toString('utf8')
      .split('\n');

    rows.forEach((row) => {

      if (String(row).trim().length > 0) {

        const cells = row.split(/\t|,/);

        const locationType = String(cells[0]).trim();
        const serviceDeliveryPoint = String(cells[1]).trim();
        const htsAccessType = String(cells[2]).trim();
        const partnerHIVStatus = String(cells[3]).trim();
        const clientAge = String(cells[4]).trim();
        const gender = String(cells[5]).trim();
        const htsSetting = String(cells[6]).trim();
        const htsModality = String(cells[7]).trim();

        if (mappings.serviceDeliveryPoints.indexOf(serviceDeliveryPoint) < 0)
          mappings.serviceDeliveryPoints.push(serviceDeliveryPoint);

        if (mappings.partnerHIVStatuses.indexOf(partnerHIVStatus) < 0)
          mappings.partnerHIVStatuses.push(partnerHIVStatus);

        if (mappings.clientAges.indexOf(clientAge) < 0)
          mappings.clientAges.push(clientAge);

        if (mappings.genders.indexOf(gender) < 0)
          mappings.genders.push(gender);

        if (mappings.htsSettings.indexOf(htsSetting) < 0)
          mappings.htsSettings.push(htsSetting);

        if (mappings.htsModalities.indexOf(htsModality) < 0)
          mappings.htsModalities.push(htsModality);

        if (!json[locationType])
          json[locationType] = {};

        if (!json[locationType][serviceDeliveryPoint])
          json[locationType][serviceDeliveryPoint] = {};

        if (!json[locationType][serviceDeliveryPoint][htsAccessType])
          json[locationType][serviceDeliveryPoint][htsAccessType] = {};

        if (!json[locationType][serviceDeliveryPoint][htsAccessType][partnerHIVStatus])
          json[locationType][serviceDeliveryPoint][htsAccessType][partnerHIVStatus] = {};

        if (!json[locationType][serviceDeliveryPoint][htsAccessType][partnerHIVStatus][gender])
          json[locationType][serviceDeliveryPoint][htsAccessType][partnerHIVStatus][gender] = {};

        if (!json[locationType][serviceDeliveryPoint][htsAccessType][partnerHIVStatus][gender][clientAge])
          json[locationType][serviceDeliveryPoint][htsAccessType][partnerHIVStatus][gender][clientAge] = {};

        json[locationType][serviceDeliveryPoint][htsAccessType][partnerHIVStatus][gender][clientAge] = {
          "HTS Setting": htsSetting,
          "HTS Modality": htsModality
        };

      }

    })

    fs.writeFileSync("./serviceDeliveryPoints.json", JSON.stringify(mappings.serviceDeliveryPoints, null, 2));
    fs.writeFileSync("./partnerHIVStatuses.json", JSON.stringify(mappings.partnerHIVStatuses, null, 2));
    fs.writeFileSync("./genders.json", JSON.stringify(mappings.genders, null, 2));
    fs.writeFileSync("./clientAges.json", JSON.stringify(mappings.clientAges, null, 2));
    fs.writeFileSync("./htsSettings.json", JSON.stringify(mappings.htsSettings, null, 2));
    fs.writeFileSync("./htsModalities.json", JSON.stringify(mappings.htsModalities, null, 2));
    fs.writeFileSync("./htsIndicatorsMapping.json", JSON.stringify(json, null, 2));

  }

}
