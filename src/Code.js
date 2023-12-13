function padTo2Digits(num) {
  Logger.log("I made this change in the server environment")
  Logger.log("I made this change in the local environment");
  return num.toString().padStart(2, '0');
}
function formatDate(date) {
  return [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    date.getFullYear(),
  ].join('/');
}


function createNewTab() {
  const date = formatDate(new Date())
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.insertSheet();
  const newSheet = ss.getSheets().filter(sheet => sheet.getName().startsWith('Sheet'))[0];
  const newName = newSheet.setName(date).getName()
  const headerRange =newSheet.getRange('A1:H1');
  headerRange.setValues([headers]);
  headerRange.setWrap(true);
  headerRange.setBorder(true,true,true,true,true,true);
  const hiders = ss.getSheets().filter(sheet => sheet.getName()!==date)
  hiders.forEach(hider => hider.hideSheet())
  setFormulas(newName)
}

function setFormulas(destSheet){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(destSheet)
  sheet.getRange('H2:H').setFormula(`=IFERROR(VLOOKUP(E2,'School Lookup'!$A$2:$B$12,2,FALSE),\"\")`)
  sheet.getRange('I2:I').setFormula(`=IFERROR(VLOOKUP(E2,'School Lookup'!$A$2:$G$12,6,FALSE),\"\")`)
  sheet.getRange('K6').setFormula(`=query(H2:H,"SELECT H, COUNT(H) GROUP BY H  LABEL COUNT(H) 'By School'")`)
}

function getKids(school){
  // const school = "Nellie"
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const students = sheet.getRange(1,1,sheet.getLastRow()-1,8).getValues().filter(row => row[7]!=='#N/A'&& row[7]===school)
    .map(row =>
    [ `Name: ${row[1]}`,
      `Perm #: ${row[0]}`,
      `Grade Level: Grade ${row[2]}`,
      `Registration Date: ${Utilities.formatDate(new Date(row[5]),"GMT","MM/dd/yyyy")}`,
      `Notes: ${row[6]}`,
      `School: ${row[7]}`
  
    ]);

  return students;
}

function getEmails(){
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName('School Lookup')
    const registrars = sheet.getRange('B2:F11').getValues().filter(row => row[0] !=='#N/A');
    return registrars;
}

function sendIt(recipient,school,message){
    const app = MailApp;
    app.sendEmail({
      to: recipient,
      subject: `Out of State EL Followup for ${school}`,
      body: message,
      bcc: 'inpcampbell@woodburnsd.org'
    })
   
}

function sendEmails(){
   const ss = SpreadsheetApp.getActive();
   const sheet = ss.getActiveSheet()
   const schools =[...new Set(sheet.getRange('H2:H').getValues().filter(val =>val[0]!=='').map(val => val[0]))]
   const lookupSheet = ss.getSheetByName('School Lookup');
   lookupSheet.getRange("B1:G11").getValues().slice(1).filter(row => schools.includes(row[0])).map(row => sendIt(row[5],row[0],message(row[4],getKids(row[0]))))
   Logger.log("Emails were sent")
} 
function getQuery() {
  var html = HtmlService.createHtmlOutputFromFile("index").setTitle("Copy Query")
  var ui = SpreadsheetApp.getUi(); // Or DocumentApp or SlidesApp or FormApp.
  ui.showSidebar(html);
}

function createSpreadsheetOpenTrigger() {
  const ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('getQuery')
      .forSpreadsheet(ss)
      .onOpen()
      .create();
}



// kids = 7, emails = 0

function initMenu(){
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Report Functions')
    .addItem('Create New Tabs','createNewTabs')
    .addItem('Fix Columns','fixColumns')
    .addItem("Send Emails","sendEmails")
    .addItem("Display Form","getQuery")
    .addToUi()
}

function onOpen(e){
  initMenu();
}

const headers = [
  'student_number',
  'lastfirst',
  'grade_level',
  'home_room',	
  'Enrollment_SchoolID',	
  'U_Students_Extension.Reg_Cmpltn_Date',	
  'U_Students_Extension.EL_Followup_Notes',
  'School'
]

const tabs = [
  'Homeless=1Master','Courses&ProgramsMaster','FollowupMaster'
]

const message = (registrar,students) => `Hi ${registrar},

I hope you are having a good day! 

I am following up about EL students who have recently come to Woodburn from out of state. 

I am checking to see if Cume files for the following students have arrived:


${students.map(student => student.join(' ; ').concat(' \n').concat(' \n'))}


If the Cum files have arrived, could you please send me the information included in the followup notes for each student? I will pass that information along to Debbie Ballweber. 


If the Cum files have not arrived, if you could let me know when they do, that would be great!


Thank you! \n`;



