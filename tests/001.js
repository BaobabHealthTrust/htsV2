module.exports = {
  '#1': function (client) {
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
      .containsText('.sectionHeader', 'HTS Visit')
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
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Client gives consent to be tested?')
      .assert
      .visible('#Yes')
      .click('#Yes')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#btnNonReactive', 3000)
      .click('#btnNonReactive')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('.popup', 3000)
      .assert
      .visible('#btnAlertOK')
      .click('#btnAlertOK')
      .assert
      .visible('#No_Partner')
      .click('#No_Partner')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Number of male condoms given')
      .assert
      .visible('#num_0')
      .click('#num_0')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Number of female condoms given')
      .assert
      .visible('#num_0')
      .click('#num_0')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#chkNone', 3000)
      .click('#chkNone')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Comments')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#btnTranscribe', 3000)
      .assert
      .visible('#btnTranscribe')
      .click('#btnTranscribe')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Select Entry Code')
      .end()
  }
}