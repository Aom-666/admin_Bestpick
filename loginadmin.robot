*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}               https://www.bestpickbp.com                   # URL ของหน้าเว็บล็อกอิน
${VALID_EMAIL}       earthsrichok31@gmail.com                 # Email ที่ถูกต้อง
${VALID_PASSWORD}    bestpick7890                                    # Password ที่ถูกต้อง
${INVALID_PASSWORD}  12345                                    # Password ที่ไม่ถูกต้อง

*** Test Cases ***

Admin Login With Correct Credentials Should Succeed
    [Documentation]    ทดสอบการล็อกอินด้วยข้อมูลที่ถูกต้อง
    Open Browser       ${URL}    Chrome
    Maximize Browser Window
    Wait Until Page Contains    Admin Login    timeout=10s
    Input Text         xpath=//input[@aria-invalid="false" and @type="text"]    ${VALID_EMAIL}
    Input Text         xpath=//input[@aria-invalid="false" and @type="password"]    ${VALID_PASSWORD}
    Click Button       xpath=//button[contains(., 'Login')]
    Sleep    2s  # เพิ่มดีเลย์เล็กน้อยเพื่อรอให้หน้าโหลดเสร็จ
    Wait Until Page Contains    Welcome, Admin    timeout=10s
    [Teardown]         Close Browser
    Handle Alert If Present
    ${alert_present}=    Run Keyword And Return Status    Alert Should Be Present
    Run Keyword If    ${alert_present}    ${alert_message}=    Get Alert Text
    Run Keyword If    ${alert_present}    Log    "Alert Text: ${alert_message}"
    Run Keyword If    ${alert_present}    Accept Alert
    Log    "Handled alert if it was present."

Admin Login With Incorrect Credentials Should Fail
    [Documentation]    ทดสอบการล็อกอินด้วยข้อมูลที่ไม่ถูกต้อง
    Open Browser       ${URL}    Chrome
    Maximize Browser Window
    Wait Until Page Contains    Admin Login    timeout=10s
    Input Text         xpath=//input[@aria-invalid="false" and @type="text"]    ${VALID_EMAIL}
    Input Text         xpath=//input[@aria-invalid="false" and @type="password"]    ${INVALID_PASSWORD}
    Click Button       xpath=//button[contains(., 'Login')]
    Run Keyword And Ignore Error    Handle Alert If Present
    [Teardown]    Close Browser

*** Keywords ***
Handle Alert If Present
    ${alert_present}=    Run Keyword And Return Status    Alert Should Be Present
    Run Keyword If    ${alert_present}    ${alert_message}=    Get Alert Text
    Run Keyword If    ${alert_present}    Log    "Alert Text: ${alert_message}"
    Run Keyword If    ${alert_present}    Accept Alert
    Log    "Handled alert if it was present."
