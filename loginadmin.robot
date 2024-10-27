*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}               http://localhost:3001                    # URL ของหน้าเว็บล็อกอิน
${VALID_EMAIL}       earthsrichok31@gmail.com                 # Email ที่ถูกต้อง
${VALID_PASSWORD}    1234                                     # Password ที่ถูกต้อง
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
    Wait Until Page Contains    Welcome, Admin    timeout=10s
    [Teardown]         Close Browser

Admin Login With Incorrect Credentials Should Fail
    [Documentation]    ทดสอบการล็อกอินด้วยข้อมูลที่ไม่ถูกต้อง
    Open Browser       ${URL}    Chrome
    Maximize Browser Window
    Wait Until Page Contains    Admin Login    timeout=10s
    Input Text         xpath=//input[@aria-invalid="false" and @type="text"]    ${VALID_EMAIL}
    Input Text         xpath=//input[@aria-invalid="false" and @type="password"]    ${INVALID_PASSWORD}
    Click Button       xpath=//button[contains(., 'Login')]

    # จัดการกับ alert ถ้ามี
    Run Keyword And Ignore Error    Handle Alert If Present

    [Teardown]    Close Browser

*** Keywords ***
Handle Alert If Present
    ${alert_message}=    Run Keyword And Ignore Error    Get Alert Message
    Run Keyword If    "${alert_message}" == "Login failed"    Accept Alert


