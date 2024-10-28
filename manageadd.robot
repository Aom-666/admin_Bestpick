*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${LOGIN_URL}             http://localhost:3001/login
${MANAGE_ADD_URL}        http://localhost:3001/manageadd
${ADD_AD_URL}            http://localhost:3001/add
${VALID_EMAIL}           earthsrichok31@gmail.com
${VALID_PASSWORD}        1234
${TITLE}                 Kingston SSD
${CONTENT}               Kingston NV2 PCIe 4.0 NVMe SSD
${LINK}                  https://www.example.com
${IMAGE_PATH}            C:/Users/pongp/Pictures/Saved Pictures/kingston-nm2-500gb-2-square_medium.webp
${CREATED_AT}            2024-10-27T14:00
${UPDATED_AT}            2024-10-27T14:10
${EXPIRATION_DATE}       2024-11-30

*** Test Cases ***
Add New Ad Should Succeed
    [Documentation]    ทดสอบการล็อกอินและเพิ่มโฆษณาใหม่
    Open Browser       ${LOGIN_URL}    Chrome
    Maximize Browser Window
    Input Text         xpath=//input[@aria-invalid="false" and @type="text"]    ${VALID_EMAIL}
    Input Text         xpath=//input[@aria-invalid="false" and @type="password"]    ${VALID_PASSWORD}
    Click Button       xpath=//button[contains(., 'Login')]
    Wait Until Page Contains    Welcome, Admin    timeout=10s
    Go To              ${MANAGE_ADD_URL}
    Wait Until Page Contains    Manage Ads    timeout=10s

    Click Element      xpath=//a[@href="/add"]
    Wait Until Page Contains    Add Ad    timeout=10s
    
    Input Text         xpath=//input[@name="title"]    ${TITLE}
    Input Text         xpath=//input[@name="content"]  ${CONTENT}
    Input Text         xpath=//input[@name="link"]     ${LINK}
    Choose File        xpath=//input[@type="file"]     ${IMAGE_PATH}

    Execute JavaScript    document.querySelector('input[name="created_at"]').value = "${CREATED_AT}"
    Execute JavaScript    document.querySelector('input[name="updated_at"]').value = "${UPDATED_AT}"
    Execute JavaScript    document.querySelector('input[name="expiration_date"]').value = "${EXPIRATION_DATE}"

    Click Element      id=mui-component-select-status
    Sleep              1s  # รอให้ dropdown แสดงผล

    Click Element      xpath=//li[@data-value="active"]

    Click Button       xpath=//button[contains(., 'Add Ad')]
    Sleep              2s  # รอ 2 วินาทีให้ข้อมูลอัปเดตในหน้าเว็บ

    Wait Until Page Contains    ${TITLE}    timeout=15s

    [Teardown]         Close Browser
