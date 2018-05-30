module.exports = {
  'Anonymous Client: Never tested - Negative': function (client) {
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
      .click('#btnNext.green.nav-buttons')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Client gives consent to be tested?')
      .assert
      .visible('#liYes')
      .click('#liYes')
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('#lblResult', 5000)
      .assert
      .containsText('#lblResult', 'First Pass Test 1 Result')
      .assert
      .visible('#btnNonReactive')
      .click('#btnNonReactive')
      .click('#btnNext')
      .waitForElementVisible('#alertTitle', 1000)
      .assert
      .containsText('#alertTitle', 'Referral')
      .assert
      .visible('#btnAlertOK')
      .click('#btnAlertOK')
      .assert
      .containsText('#u14HelpText', 'Number of male condoms given')
      .assert
      .visible('#num_0')
      .click('#num_0')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Number of female condoms given')
      .assert
      .visible('#num_0')
      .click('#num_0')
      .click('#btnNext')
      .waitForElementVisible('#chkNone', 1000)
      .click('#chkNone')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Comments')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 1000)
      .assert
      .containsText('#u14HelpText', 'Register Number (from cover)')
      .waitForElementVisible('#li1__Health_Facility___Inpatient_', 5000)
      .assert
      .visible('#li1__Health_Facility___Inpatient_')
      .click('#li1__Health_Facility___Inpatient_')
      .pause(1000)
      .waitForElementVisible('#btnNext', 3000)
      .assert
      .visible('#btnNext')
      .click('#btnNext')
      .waitForElementVisible('.sectionHeader', 1000)
      .assert
      .containsText('.sectionHeader', 'Transcribe in Register')
      .click('#btnNext')
      .waitForElementVisible('#task-Overview', 5000)
      .assert
      .containsText('#task-Overview', 'Overview')
      .end()
  }
}