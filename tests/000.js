module.exports = {
  'Add Register': function (client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .assert
      .title('HTS')
      .assert
      .visible('#txtUsername')
      .click('#txtUsername')
      .waitForElementVisible('#dha_C', 1000)
      .click('#dha_C')
      .click('#dha_P')
      .click('#dha_6')
      .click('#dha_K')
      .assert
      .visible('#txtPassword')
      .click('#txtPassword')
      .assert
      .visible('#qwe_t')
      .click('#qwe_t')
      .click('#qwe_e')
      .click('#qwe_s')
      .click('#qwe_t')
      .assert
      .visible('#btnLogin')
      .click('#btnLogin')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Scan Workstation Location')
      .assert
      .visible('#touchscreenTextInput')
      .setValue('#touchscreenTextInput', 'Room 1$')
      .waitForElementVisible('#facility', 3000)
      .assert
      .visible('#li-HTS')
      .click('#li-HTS')
      .waitForElementVisible('#btnNext.green.nav-buttons', 1000)
      .assert
      .visible('#task-Administration')
      .click('#task-Administration')
      .waitForElementVisible('#btnManageRegisters', 3000)
      .assert
      .visible('#btnManageRegisters')
      .click('#btnManageRegisters')
      .waitForElementVisible('#btnAddRegister', 3000)
      .click('#btnAddRegister')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Register Number')
      .assert
      .visible('#num_1')
      .click('#num_1')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Location Type')
      .assert
      .visible('#Health_Facility')
      .click('#Health_Facility')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Service Delivery Point')
      .assert
      .visible('#Inpatient')
      .click('#Inpatient')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .end()
  }
}