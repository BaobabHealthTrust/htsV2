module.exports = {
  '#21': function (client) {
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
      .visible('li#Yes')
      .click('li#Yes')
      .click('#btnNext')
      .assert
      .containsText('#u14HelpText', 'Search by name?')
      .assert
      .visible('li#Yes')
      .click('#Yes')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'First Name')
      .assert
      .visible('#qwe_j')
      .assert
      .visible('#qwe_o')
      .assert
      .visible('#qwe_h')
      .assert
      .visible('#qwe_n')
      .click('#qwe_j')
      .click('#qwe_o')
      .click('#qwe_h')
      .click('#qwe_n')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Last Name')
      .assert
      .visible('#qwe_b')
      .assert
      .visible('#qwe_n')
      .assert
      .visible('#qwe_d')
      .click('#qwe_b')
      .click('#qwe_a')
      .click('#qwe_n')
      .click('#qwe_d')
      .click('#qwe_a')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Gender')
      .assert
      .visible('li#Male')
      .click('#Male')
      .click('#btnNext')
      .waitForElementVisible('#ddeHelpText', 3000)
      .assert
      .containsText('#ddeHelpText', 'Select or Create New Client')
      .assert
      .visible('#btnClear')
      .assert
      .containsText('#btnClear', 'New Client')
      .pause(3000)
      .click('#btnClear')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Year of Birth')
      .assert
      .visible('#num_Unknown')
      .click('#num_Unknown')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Age')
      .assert
      .visible('#period_2')
      .assert
      .visible('#period_0')
      .assert
      .visible('#period_year')
      .assert
      .visible('#touchscreenTextInput')
      .click('#period_2')
      .click('#period_0')
      .click('#period_year')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Malawian?')
      .assert
      .visible('li#No')
      .assert
      .visible('li#Yes')
      .click('#Yes')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Region of Origin')
      .assert
      .visible('li#Central_Region')
      .click('#Central_Region')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'District of Origin')
      .assert
      .visible('li#Dedza')
      .click('#Dedza')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Current Region')
      .assert
      .visible('li#Central_Region')
      .click('#Central_Region')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Current District')
      .assert
      .visible('li#Dedza')
      .click('#Dedza')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Current T/A')
      .assert
      .visible('li#Chauma')
      .click('#Chauma')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Current Village')
      .click('#qwe_m')
      .click('#qwe_c')
      .click('#qwe_h')
      .assert
      .visible('li#Mchepa')
      .click('#Mchepa')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Cell Phone Number')
      .assert
      .visible('#num_Unknown')
      .click('#num_Unknown')
      .click('#btnNext')
      .pause(2000)
      .waitForElementVisible('#btnNext.green', 3000)
      .assert
      .containsText('#u14HelpText', 'Partner present')
      .assert
      .visible('#No')
      .click('#No')
      .click('#btnNext.green')
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
      .click('#btnNext')
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
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Client gives consent to be tested?')
      .assert
      .visible('#Yes')
      .click('#Yes')
      .click('#btnNext')
      .waitForElementVisible('#lblResult', 3000)
      .assert
      .visible('#btnNonReactive')
      .assert
      .containsText('#lblResult', 'First Pass Test 1 Result')
      .assert
      .visible('#btnNonReactive')
      .click('#btnNonReactive')
      .click('#btnNext')
      .waitForElementVisible('#btnAlertOK', 3000)
      .click('#btnAlertOK')
      .assert
      .containsText('.label', 'Summary')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'HTS Family Ref Slips')
      .assert
      .containsText('.sectionHeader', 'Post-Test Counseling')
      .waitForElementVisible('#touchscreenTextInput', 1000)
      .setValue('#touchscreenTextInput', '1')
      .click('#btnNext')
      .waitForElementVisible('#u14HelpText', 3000)
      .assert
      .containsText('#u14HelpText', 'Comments')
      .click('#btnNext')
      .waitForElementVisible('.label', 3000)
      .assert
      .containsText('.label', 'Summary')
      .click('#btnNext')
      .waitForElementVisible('li.selectLabel.selected', 3000)
      .end()
  }
}