module.exports = {
  'Anonymous Client: Refuses Test': function (client) {
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
      .visible('#btnNext.green.nav-buttons')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Client consents to be contacted')
      .assert
      .visible('#liNo.selectLi')
      .click('#liNo.selectLi')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Age')
      .assert
      .visible('#period_3')
      .assert
      .visible('#period_year')
      .click('#period_3')
      .click('#period_3')
      .click('#period_year')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Gender')
      .assert
      .visible('#liFemale.selectLi')
      .click('#liFemale.selectLi')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Partner present')
      .assert
      .visible('#liNo.selectLi')
      .click('#liNo.selectLi')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'HTS Access Type')
      .assert
      .visible('#liRoutine_HTS__PITC__within_Health_Service.selectLi')
      .click('#liRoutine_HTS__PITC__within_Health_Service.selectLi')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Last HIV Test Result')
      .assert
      .visible('#liNever_Tested.selectLi')
      .click('#liNever_Tested.selectLi')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Client Risk Category')
      .assert
      .visible('#liLow_Risk.selectLi')
      .click('#liLow_Risk.selectLi')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Pregnant?')
      .assert
      .visible('#liNo.selectLi')
      .click('#liNo.selectLi')
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Client gives consent to be tested?')
      .assert
      .visible('#liNo.selectLi')
      .click('#liNo.selectLi')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .pause(1000)
      .click('#btnCancel')
      .waitForElementVisible('#task-Overview', 5000)
      .assert
      .containsText('#task-Overview', 'Overview')
      .end()
  }
}