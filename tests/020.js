module.exports = {
  '#20': function (client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .assert
      .title('HTS')
      .assert
      .visible('#btnBD.gray.nav-buttons')
      .assert
      .visible('#btnNext.gray.nav-buttons')
      .assert
      .visible('#li-HTS')
      .click('#li-HTS')
      .waitForElementVisible('#btnNext.green.nav-buttons', 1000)
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('.sectionHeader', 'Find Client By Name')
      .assert
      .visible('#u14HelpText', 'Client consents to be contacted')
      .assert
      .visible('li#No')
      .click('li#No')
      .click('#btnNext')
      .assert
      .containsText('#u14HelpText', 'Age')
      .assert
      .visible('#period_1')
      .assert
      .visible('#period_0')
      .assert
      .visible('#period_year')
      .assert
      .visible('#touchscreenTextInput')
      .click('#period_1')
      .click('#period_0')
      .click('#period_year')
      .click('#btnNext')
      .assert
      .containsText('#u14HelpText', 'Gender')
      .assert
      .visible('li#Male')
      .click('#Male')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Service Delivery Point')
      .assert
      .containsText('.sectionHeader', 'Pre-Test Counseling')
      .waitForElementVisible('#touchscreenTextInput', 1000)
      .assert
      .visible('#touchscreenTextInput')
      .setValue('#touchscreenTextInput', 'V')
      .waitForElementVisible('#VCT', 1000)
      .click('#VCT')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'HTS Access Type')
      .assert
      .visible('#Routine_HTS__PITC__within_Health_Service')
      .click('#Routine_HTS__PITC__within_Health_Service')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Last HIV Test Result')
      .assert
      .visible('#Last_Inconclusive')
      .click('#Last_Inconclusive')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Time since last HIV Test')
      .assert
      .visible('#touchscreenTextInput')
      .assert
      .visible('#period_2')
      .assert
      .visible('#period_year')
      .click('#period_2')
      .click('#period_year')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Client Risk Category')
      .assert
      .visible('#Low_Risk')
      .click('#Low_Risk')
      .waitForElementVisible('.label', 3000)
      .assert
      .containsText('.label', 'Summary')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Client gives consent to be tested?')
      .assert
      .visible('#Yes')
      .click('#Yes')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#lblResult', 3000)
      .assert
      .visible('#btnReactive1')
      .assert
      .visible('#btnNonReactive1')
      .assert
      .visible('#btnNonReactive2')
      .assert
      .containsText('#lblResult', 'First Pass Parallel Test 1 & 2 Results')
      .click('#btnReactive1')
      .click('#btnReactive2')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#btnAlertOK', 3000)
      .click('#btnAlertOK')
      .assert
      .containsText('.label', 'Summary')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Appointment Date Given')
      .assert
      .visible('#btnAddMonth')
      .click('#btnAddMonth')
      .click('#btnAddMonth')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'HTS Family Ref Slips')
      .assert
      .containsText('.sectionHeader', 'Post-Test Counseling')
      .waitForElementVisible('#touchscreenTextInput', 1000)
      .setValue('#touchscreenTextInput', '0')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Comments')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('.label', 3000)
      .assert
      .containsText('.label', 'Summary')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('li.selectLabel.selected', 3000)
      .end()
  }
}