*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${LOGIN_URL}                  http://localhost:3001
${MANAGE_REPORTED_POSTS_URL}  http://localhost:3001/manage-reported-posts
${VALID_EMAIL}                earthsrichok31@gmail.com
${VALID_PASSWORD}             1234
${POST_TITLE}                 Airpod review      # ชื่อของโพสต์ที่ต้องการแก้ไข
${REASON}                     Copyright Violation # เหตุผลที่ต้องการระบุ
${NEW_STATUS}                 Block              # สถานะใหม่ที่ต้องการเซ็ต
${RESTORE_STATUS}             Normally           # สถานะเดิมที่ต้องการเซ็ต

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
    [Arguments]    ${post_title}    ${reason}    ${new_status}
    Go To                       ${MANAGE_REPORTED_POSTS_URL}
    Wait Until Page Contains    Manage Reported Posts    timeout=15s
    Log    Attempting to find and click the edit button for post titled: ${post_title} with reason: ${reason}

    # เลื่อนหน้าจอให้แถวที่มีปุ่ม Edit ปรากฏ
    Execute Javascript    window.scrollBy(0, document.body.scrollHeight)

    # ใช้ XPath แบบง่ายในการคลิกปุ่ม Edit
    Wait Until Element Is Visible    xpath=//button[.//svg[@data-testid='EditIcon']]    timeout=10s
    Click Element    xpath=//button[.//svg[@data-testid='EditIcon']]

    # รอให้ popup แก้ไขสถานะปรากฏ
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'edit-report-status-popup')]    timeout=10s

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
    Edit Reported Post Status    ${POST_TITLE}    ${REASON}    ${NEW_STATUS}
    # คืนสถานะให้กลับเป็น Normally
    Edit Reported Post Status    ${POST_TITLE}    ${REASON}    ${RESTORE_STATUS}
    Click Button                xpath=//button[text()="Logout"]
    [Teardown]                  Close Browser
