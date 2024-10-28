*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${LOGIN_URL}                  https://www.bestpickbp.com/login
${MANAGE_REPORTED_POSTS_URL}  https://www.bestpickbp.com/manage-reported-posts
${VALID_EMAIL}                earthsrichok31@gmail.com
${VALID_PASSWORD}             1234
${NEW_STATUS}                 Block              # สถานะใหม่ที่ต้องการเซ็ต

*** Keywords ***
Login As Admin
    Open Browser    ${LOGIN_URL}    Chrome
    Set Window Size    1920    1080
    Maximize Browser Window
    Wait Until Element Is Visible    xpath=//input[@type="text"]    timeout=10s
    Input Text    xpath=//input[@type="text"]    ${VALID_EMAIL}
    Wait Until Element Is Visible    xpath=//input[@type="password"]    timeout=10s
    Input Text    xpath=//input[@type="password"]    ${VALID_PASSWORD}
    Click Button    xpath=//button[contains(., 'Login')]
    Wait Until Page Contains    Welcome, Admin    timeout=10s

Edit First Reported Post Status
    [Arguments]    ${status}
    Go To    ${MANAGE_REPORTED_POSTS_URL}
    Wait Until Element Is Visible    xpath=//table[contains(@class, 'MuiTable-root')]    timeout=15s

    # รอให้ปุ่ม Edit ในแถวแรกปรากฏแล้วคลิก
    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/div/table/tbody/tr[1]/td[6]/button    timeout=10s
    Click Element    xpath=//*[@id="root"]/div/div/div/table/tbody/tr[1]/td[6]/button

    # รอให้ popup แก้ไขสถานะปรากฏ
    Sleep    2s
    Wait Until Element Is Visible    xpath=//div[@role="dialog"]    timeout=20s

    # คลิกเพื่อเปิด dropdown ของสถานะโดยใช้ XPath ที่ระบุ
    Sleep    1s
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'MuiSelect-select')]    timeout=10s
    Click Element    xpath=//div[contains(@class, 'MuiSelect-select')]

    # รอให้ตัวเลือกใน dropdown ปรากฏแล้วเลือกสถานะ
    Wait Until Element Is Visible    xpath=//li[contains(., 'Block')]    timeout=10s
    Click Element    xpath=//li[contains(., 'Block')]

    # คลิกปุ่ม "SAVE" เพื่อบันทึกการเปลี่ยนแปลง
    Wait Until Element Is Visible    xpath=//button[text()="Save"]    timeout=10s
    Click Button    xpath=//button[text()="Save"]
    Wait Until Page Contains    ${status}    timeout=10s

*** Test Cases ***
Manage First Reported Post
    Login As Admin
    Edit First Reported Post Status    ${NEW_STATUS}
    Click Button    xpath=//*[@id="root"]/div/header/div/div[2]/button  # ปุ่ม Logout
    [Teardown]    Close Browser
