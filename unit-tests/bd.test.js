'use strict';

let chai = require('chai');
const expect = chai.expect;
const bd = require('../client-src/src/constraints').validate;

describe('Backdata Entry Validation', function () {

  it('should FAIL test for blank client', (done) => {

    const data = {};

    const result = bd(data);

    expect(result.error)
      .to
      .equal(true);

    done();

  })

  it('should FAIL test for Last Negative client without tests', (done) => {

    const data = {
      "Last HIV Test": "Never Tested"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(true);

    done();

  })

  it('should FAIL test for Last Negative client without tests', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "HIV Rapid Test Outcomes": {}
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(true);

    done();

  })

  it('should FAIL test for Last Negative client without tests', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "HIV Rapid Test Outcomes": {
        "First pass": {}
      }
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(true);

    done();

  })

  it('should FAIL test for Last Negative client with wrong data', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Negative"
        }
      },
      "Outcome Summary": "Single Negative",
      "Result Given to Client": "New Negative",
      "Client Risk Category": "Low Risk",
      "Referral for Re-Testing": "Re-Test"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(true);

    done();

  })

  it('should PASS test for Last Negative client with accurate data', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Negative"
        }
      },
      "Outcome Summary": "Single Negative",
      "Result Given to Client": "New Negative",
      "Client Risk Category": "Low Risk",
      "Referral for Re-Testing": "No Re-Test needed"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should FAIL test for Last Negative client tested positive', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive"
        }
      }
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(true);

    done();

  })

  it('should FAIL test for Last Negative client tested positive', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": ""
        }
      }
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(true);

    done();

  })

  it('should PASS test for Last Negative client tested positive', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Positive"
        }
      },
      "Outcome Summary": "Test 1 & 2 Positive",
      "Result Given to Client": "New Positive",
      "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Negative client tested negative', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Positive"
        }
      },
      "Outcome Summary": "Test 1 & 2 Positive",
      "Result Given to Client": "New Positive",
      "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should FAIL test for Last Negative client tested negative', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Negative"
        }
      },
      "Outcome Summary": "Test 1 & 2 Positive",
      "Result Given to Client": "New Positive",
      "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(true);

    done();

  })

  it('should PASS test for Last Negative client tested negative', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Negative"
        },
        "Immediate Repeat": {
          "Test 1": "Negative",
          "Test 2": "Negative"
        }
      },
      "Outcome Summary": "Test 1 & 2 Negative",
      "Result Given to Client": "New Negative",
      "Referral for Re-Testing": "No Re-Test needed",
      "Client Risk Category": "Low Risk"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Negative client tested discordant', (done) => {

    const data = {
      "Last HIV Test": "Never Tested",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Negative"
        },
        "Immediate Repeat": {
          "Test 1": "Positive",
          "Test 2": "Negative"
        }
      },
      "Outcome Summary": "Test 1 & 2 Discordant",
      "Result Given to Client": "New Inconclusive",
      "Referral for Re-Testing": "Re-Test"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Positive client tested positive', (done) => {

    const data = {
      "Last HIV Test": "Last Positive",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Positive"
        }
      },
      "Outcome Summary": "Test 1 & 2 Positive",
      "Result Given to Client": "Confirmatory Positive",
      "Referral for Re-Testing": "No Re-Test needed"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Positive client tested negative', (done) => {

    const data = {
      "Last HIV Test": "Last Positive",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Negative",
          "Test 2": "Negative"
        }
      },
      "Outcome Summary": "Test 1 & 2 Negative",
      "Result Given to Client": "Confirmatory Inconclusive",
      "Referral for Re-Testing": "Re-Test"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Positive client tested discordant', (done) => {

    const data = {
      "Last HIV Test": "Last Positive",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Negative"
        },
        "Immediate Repeat": {
          "Test 1": "Negative",
          "Test 2": "Negative"
        }
      },
      "Outcome Summary": "Test 1 & 2 Negative",
      "Result Given to Client": "Confirmatory Inconclusive",
      "Referral for Re-Testing": "Re-Test"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Positive client tested positive', (done) => {

    const data = {
      "Last HIV Test": "Last Positive",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Negative"
        },
        "Immediate Repeat": {
          "Test 1": "Positive",
          "Test 2": "Positive"
        }
      },
      "Outcome Summary": "Test 1 & 2 Positive",
      "Result Given to Client": "Confirmatory Positive",
      "Referral for Re-Testing": "No Re-Test needed"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Positive client tested and discordant', (done) => {

    const data = {
      "Last HIV Test": "Last Positive",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Negative"
        },
        "Immediate Repeat": {
          "Test 1": "Negative",
          "Test 2": "Positive"
        }
      },
      "Outcome Summary": "Test 1 & 2 Discordant",
      "Result Given to Client": "Confirmatory Inconclusive",
      "Referral for Re-Testing": "Re-Test"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Inconclusive client tested and negative', (done) => {

    const data = {
      "Last HIV Test": "Last Inconclusive",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Negative",
          "Test 2": "Negative"
        }
      },
      "Outcome Summary": "Test 1 & 2 Negative",
      "Result Given to Client": "New Negative",
      "Referral for Re-Testing": "No Re-Test needed",
      "Client Risk Category": "Low Risk"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Inconclusive client tested and positive', (done) => {

    const data = {
      "Last HIV Test": "Last Inconclusive",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Positive"
        }
      },
      "Outcome Summary": "Test 1 & 2 Positive",
      "Result Given to Client": "New Positive",
      "Referral for Re-Testing": "No Re-Test needed"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Last Inconclusive client tested and discordant', (done) => {

    const data = {
      "Last HIV Test": "Last Inconclusive",
      "Age": "47Y",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Positive",
          "Test 2": "Negative"
        }
      },
      "Outcome Summary": "Test 1 & 2 Discordant",
      "Result Given to Client": "Confirmatory Inconclusive",
      "Referral for Re-Testing": "Re-Test"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Never Tested still negative', (done) => {

    const data = {
      "HTS Provider ID": "XP6F",
      "Sex/Pregnancy": "Male",
      "Age": "47Y",
      "Age Group": "25+ years",
      "HTS Access Type": "Routine HTS (PITC) within Health Service",
      "Last HIV Test": "Never Tested",
      "Partner Present": "No",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Negative"
        }
      },
      "Outcome Summary": "Single Negative",
      "Result Given to Client": "New Negative",
      "Partner HIV Status": "No Partner",
      "Client Risk Category": "Low Risk",
      "Referral for Re-Testing": "No Re-Test needed",
      "Number of Items Given:HTS Family Ref Slips": "1"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

  it('should PASS test for Never Tested still negative but high risk', (done) => {

    const data = {
      "HTS Provider ID": "XP6F",
      "Sex/Pregnancy": "Female Non-Pregnant",
      "Age": "32Y",
      "Age Group": "25+ years",
      "HTS Access Type": "Comes with HTS Family Referral Slip",
      "Last HIV Test": "Never Tested",
      "Partner Present": "No",
      "HIV Rapid Test Outcomes": {
        "First pass": {
          "Test 1": "Negative"
        }
      },
      "Outcome Summary": "Single Negative",
      "Result Given to Client": "New Negative",
      "Partner HIV Status": "No Partner",
      "Client Risk Category": "On-going Risk",
      "Referral for Re-Testing": "Re-Test",
      "Set Date": "13 Jan 2018",
      "Register Number (from cover)": "14",
      "Current User": "XP6F",
      "id": "EC2-2"
    };

    const result = bd(data);

    expect(result.error)
      .to
      .equal(false);

    done();

  })

})
