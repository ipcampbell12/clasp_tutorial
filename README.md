1) Create a node project by running this command in the terminal: 

npm init --force 

2) Install the CLASP library 

npm install -g @google/clasp

3) Make sure the Google Apps Script API is turned on by going to this link: 

https://script.google.com/home/usersettings

4) run this command to log in

clasp login

5) To add a google apps script project from the server to your local environment, run the following command.

clasp clone "<scriptId>" --rootDir <directoryName>

-- note: ".gs" files will be changed to ".js" files 
-- You might need to move the .clasp.json file into the root directory

6) To push any changes you have saved on the local environment to the server, run the following command: 

clasp push 

--Run this command in the root directory
--You willl need to refresh the apps script editor to see the changes

7) To pull changes made in server environment to local environment, run this command: 

clasp pull

8) To avoid having to keep pushing and pull changes try this commmand: 

clasp push -w 

--It will listen for changes that are made and will add them once I have saved them
--It will find those changes you made and automatically change them 
--Ctrl -c to exit watch environment

9) To get GAS methods auto complete, you have install an additional package: 

=> Go to clasp documentation
=> Go to docs
=> go to typescript.md file

Run the following command: 

npm i -S @types/google-apps-script