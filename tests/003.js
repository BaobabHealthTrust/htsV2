module.exports = {
  '#3': function (client) {
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
      .visible('#period_3')
      .assert
      .visible('#period_month')
      .assert
      .visible('#touchscreenTextInput')
      .click('#period_3')
      .click('#period_month')
      .click('#btnNext')
      .assert
      .containsText('#u14HelpText', 'Gender')
      .assert
      .visible('li#Female')
      .click('#Female')
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
      .visible('#Never_Tested')
      .click('#Never_Tested')
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
      .visible('#btnReactive')
      .assert
      .containsText('#lblResult', 'First Pass Test 1 Result')
      .click('#btnReactive')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#lblResult', 3000)
      .assert
      .visible('#btnReactive')
      .assert
      .containsText('#lblResult', 'First Pass Test 2 Result')
      .click('#btnReactive')
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
      .setValue('#touchscreenTextInput', '1')
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