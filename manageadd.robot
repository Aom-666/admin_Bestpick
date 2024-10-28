*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${LOGIN_URL}             https://www.bestpickbp.com/login
${MANAGE_ADD_URL}        https://www.bestpickbp.com/manageadd
${VALID_EMAIL}           earthsrichok31@gmail.com
${VALID_PASSWORD}        1234
${TITLE}                 Kingston SSD
${CONTENT}               SSD M.2 PCIe 250GB (3Y) Kingston NV1 (SNVS/250G)
${LINK}                  https://www.advice.co.th
${IMAGE_PATH}            C:\\Users\\pongp\\Pictures\\Saved Pictures\\A0140568OK_BIG_1.jpg
${CREATED_AT}            2024-10-27T14:00
${UPDATED_AT}            2024-10-27T14:10
${EXPIRATION_DATE}       11/30/2024 

*** Test Cases ***
Add New Ad Should Succeed
    [Documentation]    ทดสอบการล็อกอินและเพิ่มโฆษณาใหม่
    Open Browser       ${LOGIN_URL}    Chrome
    Maximize Browser Window
    Input Text         xpath=//input[@type="text"]    ${VALID_EMAIL}
    Input Text         xpath=//input[@type="password"]    ${VALID_PASSWORD}
    Click Button       xpath=//button[contains(., 'Login')]
    Wait Until Page Contains    Welcome, Admin    timeout=10s
    
    Go To              ${MANAGE_ADD_URL}
    Wait Until Page Contains    Manage Ads    timeout=10s

    Click Element      xpath=//a[@href="/add"]
    Wait Until Page Contains    Add Ad    timeout=10s

    Input Text         xpath=//input[@name="title"]    ${TITLE}
    Input Text         xpath=//input[@name="content"]  ${CONTENT}
    Input Text         xpath=//input[@name="link"]     ${LINK}

    Wait Until Element Is Visible    xpath=//input[@type="file"]    timeout=10s
    Choose File        xpath=//input[@type="file"]     ${IMAGE_PATH}

    # กรอกข้อมูลวันที่
    Input Text         xpath=//input[@name="created_at"]    ${CREATED_AT}
    Input Text         xpath=//input[@name="updated_at"]    ${UPDATED_AT}
    Input Text         xpath=//input[@name="expiration_date"]    ${EXPIRATION_DATE}

    # รอให้ปุ่ม Add Ad ปรากฏและคลิก
    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/form/button    timeout=10s
    Click Button       xpath=//*[@id="root"]/div/form/button
    Sleep              2s  # รอให้ข้อมูลอัปเดตในหน้าเว็บ

    # ตรวจสอบว่าการเพิ่มโฆษณาสำเร็จหรือไม่
    Wait Until Page Contains    ${TITLE}    timeout=15s

    [Teardown]         Close Browser
