*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${LOGIN_URL}         https://www.bestpickbp.com/login
${MANAGE_USER_URL}   https://www.bestpickbp.com/manageuser
${VALID_EMAIL}       earthsrichok31@gmail.com
${VALID_PASSWORD}    1234
${USER_ID}           870001               # ID ของผู้ใช้ที่ต้องการแก้ไข
${DEACTIVE_STATUS}   Deactive             # ค่าใหม่ของสถานะที่ต้องการเซ็ต
${ACTIVE_STATUS}     Active               # ค่าเริ่มต้นของสถานะที่ต้องการเซ็ตกลับ

*** Test Cases ***

Login, Edit User Status to Deactive, and Then Back to Active
    [Documentation]  ทดสอบการล็อกอิน การเปลี่ยนสถานะของผู้ใช้ในหน้า Manage Users และเปลี่ยนสถานะกลับ
    Open Browser     ${LOGIN_URL}    Chrome
    Maximize Browser Window

    # ขั้นตอนล็อกอิน
    Login As Admin

    # เข้าสู่หน้า Manage Users และเปลี่ยนสถานะเป็น Deactive
    Edit User Status    ${USER_ID}    ${DEACTIVE_STATUS}

    # คลิกปุ่ม Logout เพื่อออกจากระบบ
    Logout

    # ล็อกอินอีกครั้ง
    Login As Admin

    # เข้าสู่หน้า Manage Users และเปลี่ยนสถานะกลับเป็น Active
    Edit User Status    ${USER_ID}    ${ACTIVE_STATUS}

    [Teardown]                      Close Browser

*** Keywords ***
Login As Admin
    [Documentation]  ล็อกอินเข้าสู่ระบบด้วย Admin
    Go To                       ${LOGIN_URL}
    Wait Until Page Contains    Admin Login    timeout=10s
    Input Text                  xpath=//input[@aria-invalid="false" and @type="text"]    ${VALID_EMAIL}
    Input Text                  xpath=//input[@aria-invalid="false" and @type="password"]    ${VALID_PASSWORD}
    Click Button                xpath=//button[contains(., 'Login')]
    Wait Until Page Contains    Welcome, Admin    timeout=10s

Edit User Status
    [Arguments]    ${user_id}    ${status}
    [Documentation]  เปลี่ยนสถานะของผู้ใช้
    Go To                       ${MANAGE_USER_URL}
    Wait Until Page Contains    Manage Users

    # รอให้ตารางปรากฏ
    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/table/tbody    timeout=15s

    # คลิกปุ่ม Edit ของผู้ใช้ที่ต้องการแก้ไข
    Click Element               xpath=//*[@id="root"]/div/div/table/tbody/tr[td[contains(., "${user_id}")]]/td[last()]/button[1]

    # รอให้ Popup ปรากฏ
    Wait Until Page Contains    Edit User

    # คลิกเพื่อเปิด dropdown ของสถานะ
    Click Element               xpath=/html/body/div[2]/div[3]/div/div[1]/div/div/div

    # เลือกค่าใน dropdown ตามสถานะใหม่ที่ต้องการโดยอิงข้อความ
    ${status_xpath}=    Run Keyword If    '${status}' == 'Deactive'    Set Variable    //li[contains(text(), 'Deactive')]    ELSE    Set Variable    //li[contains(text(), 'Active')]
    Click Element               xpath=${status_xpath}

    # คลิกปุ่ม "SAVE" เพื่อบันทึกการเปลี่ยนแปลง
    Click Button                xpath=/html/body/div[2]/div[3]/div/div[2]/button[2]

    # ตรวจสอบผลลัพธ์ว่ามีการอัปเดตสถานะสำเร็จ
    Wait Until Page Contains    ${status}

Logout
    [Documentation]  ออกจากระบบ
    Wait Until Element Is Visible    xpath=//*[@id="root"]/header/div/button[2]    timeout=10s
    Click Element                   xpath=//*[@id="root"]/header/div/button[2]
