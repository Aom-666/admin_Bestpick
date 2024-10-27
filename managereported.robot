*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${LOGIN_URL}                  http://localhost:3001
${MANAGE_REPORTED_POSTS_URL}  http://localhost:3001/manage-reported-posts
${VALID_EMAIL}                earthsrichok31@gmail.com
${VALID_PASSWORD}             1234
${POST_ID}                    12345                  # เปลี่ยนเป็น ID ของโพสต์ที่ต้องการแก้ไข
${NEW_STATUS}                 Block                 # สถานะใหม่ที่ต้องการเซ็ต
${RESTORE_STATUS}             Normally              # สถานะเดิมที่ต้องการเซ็ต

*** Keywords ***
Login As Admin
    [Arguments]    ${email}    ${password}
    Open Browser     ${LOGIN_URL}    Chrome
    Maximize Browser Window
    Wait Until Page Contains    Admin Login    timeout=10s
    Input Text                  xpath=//input[@aria-invalid="false" and @type="text"]    ${email}
    Input Text                  xpath=//input[@aria-invalid="false" and @type="password"]    ${password}
    Click Button                xpath=//button[contains(., 'Login')]
    Wait Until Page Contains    Welcome, Admin    timeout=10s

Edit Reported Post Status
    [Arguments]    ${post_id}    ${new_status}
    Go To                       ${MANAGE_REPORTED_POSTS_URL}
    Wait Until Page Contains    Manage Reported Posts    timeout=15s
    Log    Attempting to find and click the edit button for post ID: ${post_id}
    # คลิกปุ่ม Edit โดยใช้ id
    Wait Until Element Is Visible    id=edit-button-${post_id}    timeout=10s
    Click Element                    id=edit-button-${post_id}
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'edit-report-status-popup')]
    
    # คลิกเพื่อเปิด dropdown ของสถานะ
    Click Element                    xpath=//div[contains(@class, 'MuiSelect-select')]
    Wait Until Element Is Visible    xpath=//li[@data-value="${new_status}"]
    Click Element                    xpath=//li[@data-value="${new_status}"]
    
    # คลิกปุ่ม "SAVE" เพื่อบันทึกการเปลี่ยนแปลง
    Wait Until Element Is Visible    xpath=//button[text()="Save"]
    Click Button                     xpath=//button[text()="Save"]
    Wait Until Page Contains         ${new_status}

*** Test Cases ***
Manage Reported Post
    [Documentation]  ทดสอบการล็อกอินและการแก้ไขสถานะโพสต์ที่ถูกแจ้งเตือน
    Login As Admin    ${VALID_EMAIL}    ${VALID_PASSWORD}
    Edit Reported Post Status    ${POST_ID}    ${NEW_STATUS}
    # คืนสถานะให้กลับเป็น Normally
    Edit Reported Post Status    ${POST_ID}    ${RESTORE_STATUS}
    Click Button                xpath=//button[text()="Logout"]
    [Teardown]                  Close Browser
