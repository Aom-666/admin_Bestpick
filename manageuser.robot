*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${LOGIN_URL}         http://localhost:3001
${MANAGE_USER_URL}   http://localhost:3001/manageuser
${VALID_EMAIL}       earthsrichok31@gmail.com
${VALID_PASSWORD}    1234
${USER_ID}           870001               # ID ของผู้ใช้ที่ต้องการแก้ไข
${NEW_STATUS}        Deactive             # ค่าใหม่ของสถานะที่ต้องการเซ็ต

*** Test Cases ***

Login and Edit User Status
    [Documentation]  ทดสอบการล็อกอินและการเปลี่ยนสถานะของผู้ใช้ในหน้า Manage Users
    Open Browser     ${LOGIN_URL}    Chrome
    Maximize Browser Window

    # ขั้นตอนล็อกอิน
    Wait Until Page Contains    Admin Login    timeout=10s
    Input Text                  xpath=//input[@aria-invalid="false" and @type="text"]    ${VALID_EMAIL}
    Input Text                  xpath=//input[@aria-invalid="false" and @type="password"]    ${VALID_PASSWORD}
    Click Button                xpath=//button[contains(., 'Login')]
    Wait Until Page Contains    Welcome, Admin    timeout=10s

    # เข้าสู่หน้า Manage Users
    Go To                       ${MANAGE_USER_URL}
    Wait Until Page Contains    Manage Users

    # คลิกปุ่ม Edit ของผู้ใช้ที่ต้องการแก้ไข
    Click Element               xpath=//tr[td[contains(., "${USER_ID}")]]//button[contains(@class, 'MuiIconButton-root')]

    # รอให้ Popup ปรากฏ
    Wait Until Page Contains    Edit User

    # คลิกเพื่อเปิด dropdown ของสถานะ
    Click Element               xpath=//div[contains(@class, 'MuiSelect-root')]

    # เลือกค่าใน dropdown ตามสถานะใหม่ที่ต้องการ
    Click Element               xpath=//li[contains(text(), '${NEW_STATUS}')]

    # คลิกปุ่ม "SAVE" เพื่อบันทึกการเปลี่ยนแปลง
    Click Button                xpath=//button[text()="Save"]

    # ตรวจสอบผลลัพธ์ว่ามีการอัปเดตสถานะสำเร็จ
    Wait Until Page Contains    ${NEW_STATUS}

    [Teardown]                  Close Browser
