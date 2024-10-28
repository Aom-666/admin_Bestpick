*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${LOGIN_URL}              https://www.bestpickbp.com/login
${BASE_URL}               https://www.bestpickbp.com/managecategories
${VALID_EMAIL}            earthsrichok31@gmail.com
${VALID_PASSWORD}         1234
${CATEGORY_NAME}          Mouse  # ชื่อของ Category ที่ต้องการเพิ่ม

*** Keywords ***
Login As Admin
    Open Browser    ${LOGIN_URL}    Chrome
    Maximize Browser Window
    Wait Until Element Is Visible    xpath=//input[@type="text"]    timeout=10s
    Input Text    xpath=//input[@type="text"]    ${VALID_EMAIL}
    Wait Until Element Is Visible    xpath=//input[@type="password"]    timeout=10s
    Input Text    xpath=//input[@type="password"]    ${VALID_PASSWORD}
    Click Button    xpath=//button[contains(., 'Login')]
    Wait Until Page Contains    Welcome, Admin    timeout=10s

Add New Category
    Go To    ${BASE_URL}
    Wait Until Page Contains    Manage Categories    timeout=10s
    # เลื่อนหน้าจอไปที่ปุ่ม ADD NEW CATEGORY
    Execute JavaScript    document.querySelector("button.MuiButtonBase-root").scrollIntoView();
    Sleep    2s
    # คลิกปุ่ม ADD NEW CATEGORY โดยระบุตำแหน่งตาม class โดยตรง
    Wait Until Element Is Visible    xpath=//button[contains(@class, 'MuiButtonBase-root') and contains(text(), 'Add New Category')]    timeout=10s
    Click Button    xpath=//button[contains(@class, 'MuiButtonBase-root') and contains(text(), 'Add New Category')]
    # รอให้ช่อง input ปรากฏและใส่ชื่อ Category
    Wait Until Element Is Visible    xpath=//input[contains(@id, ':')]    timeout=10s
    Input Text    xpath=//input[contains(@id, ':')]    ${CATEGORY_NAME}
    # กดปุ่มบันทึก
    Wait Until Element Is Visible    xpath=//button[normalize-space()='Save']    timeout=10s
    Click Button    xpath=//button[normalize-space()='Save']
    Wait Until Page Contains    ${CATEGORY_NAME}    timeout=10s

*** Test Cases ***
Add Category ID 21
    Login As Admin
    Add New Category
    [Teardown]    Close Browser
