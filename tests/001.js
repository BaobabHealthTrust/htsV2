module.exports = {
  '#1': function (client) {
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
      .visible('#period_2')
      .assert
      .visible('#period_year')
      .assert
      .visible('#touchscreenTextInput')
      .click('#period_3')
      .click('#period_2')
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
      .containsText('#u14HelpText', 'Partner present')
      .assert
      .visible('#No')
      .click('#No')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'HTS Access Type')
      .assert
      .containsText('.sectionHeader', 'Pre-Test Counseling')
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
      .visible('#btnNonReactive')
      .assert
      .containsText('#lblResult', 'First Pass Test 1 Result')
      .assert
      .visible('#btnNonReactive')
      .click('#btnNonReactive')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#btnAlertOK', 3000)
      .click('#btnAlertOK')
      .assert
      .containsText('.label', 'Summary')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Partner HIV Status')
      .assert
      .containsText('.sectionHeader', 'Post-Test Counseling')
      .assert
      .visible('#No_Partner')
      .click('#No_Partner')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'HTS Family Ref Slips')
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