/**
 * @fileOverview Telegram toolkit for sending messages to subscirbed users and handling (adding/deleting)
 * registered users.
 * @author <a href="mailto:jamestevers@gmail.com">James Teversham</a>
 * @version 1.1.0
 */

var config	 = require ("./config.json")
var Telegram   = require ('telebot');
var fs = require('fs');

const tg = new Telegram(config.telegramBotID); //create Telegram instance that is registered to a Telegram Bot to accept commands

/**
 * Function that uses Telegram's built-in tg.sendMessage() fn to send multiple messages to a
 * list of subscribed users. Returns an array of promises that should be monitored by the object that 
 * calls this function. 
 * 
 * @param {Object} jsonMessage - object with properties {content, target}
 * @returns {Array} - Array of Promises corresponding to each message that is sent
 */
const sendMultipleRx = exports.sendMultipleRx = (jsonMessage) => {
	let target = (jsonMessage.hasOwnProperty("target") ? jsonMessage.target : aUsers); // ? no telegramChatID in config.json
	target = (Array.isArray(target) ? target : [target])
	let promiseArr = new Array();
	for(var t of target){
        promiseArr.push(tg.sendMessage (t, "BPS Bot: " + jsonMessage.content))
    }	
    return promiseArr;
}

/**
 * Function that reads the Telegram config file (text) and returns a json object of its contents
 * 
 * @returns {object} - Array of Promises corresponding to each message that is sent
 */
const readTelegramConfig = () => {
	var myText = fs.readFileSync(config.telegramConfigFile, 'utf8'); //read synchronously (block execution)
	return JSON.parse(myText);
} 

/**
 * Function that updates (writes to) the Telegram config file. Usually when
 * creating or deleting a subscribed user.
 * 
 * @param {string} newText - Array of Promises corresponding to each message that is sent
 */
const writeTelegramConfig = (newText) => {
	fs.writeFileSync(config.telegramConfigFile, newText, function (err) {
	if (err) throw err;
	console.log('Saved! - ' + newText);
  });
}

/**
 * Recreates a string array of subscribed Telegram users (usually called once the contents of the 
 * aUsers array is changed)
 * 
 * @returns {string} - Array of Promises corresponding to each message that is sent
 */
const createTelegramString = () => { //append new user to array string
	let newConfig = "[";
	for (userName of aUsers) {
		newConfig += userName + ",";
	}
	newConfig = ((newConfig.length > 1) ? newConfig.slice (0,-1) : newConfig) + "]"
	return  newConfig
}

/**
 * Handler function for /Register or /Register <username> Telegram events. Checks if user is already registers
 * and if not, updates the telegram.config file to inclue the new user ID. Notifies Telegram supervisor when
 * a new user is registered.
 *  
 * @param {Object} msg - Telegram message object passed in from tg.on() event below
*/
const registerHandler = (msg) => {

    let firstSpace = msg.text.indexOf(" ") 
    //check if a user ide has been supplied after the \Register command (in order to register someone else)
	let newUserID = ((firstSpace >-1) ?  msg.text.substring (firstSpace + 1) : msg.from.id)
    let userExists = false;
    //search current list of subscribed users to check that this user is already subscribed
	for (thisUserID of aUsers) {
		userExists = ((thisUserID == newUserID) ? true : userExists)
	}
	if (! userExists) {
		aUsers.push(newUserID);
		let newConfig = createTelegramString()
        writeTelegramConfig (newConfig);
        if(newUserID != msg.from.id){ //if person A is registering person B
            tg.sendMessage(newUserID, " You have been registered to recieve updates from WBX gate controller at JJ Bricks").catch((err)=>console.log(err)); 
            msg.reply.text("User successfully registered.")
        }else{ //if person A is registering themself
            msg.reply.text("You have been successfully registered.")
        }
        sendMultipleRx ({content :" A new user has been registered on WBX Gate Controller", target : config.telegramSupervisor})[0].catch((err)=>console.log(err));
        //tg.sendMessage(config.telegramSupervisor, "Test").catch((err) => console.log(err)) //this works exactly the same

	} else {
		msg.reply.text("You're already registered.");
	}
}

/**
 * Handler function for /Reset Telegram command that clears (resets) the list of subscribed users
 *  
 * @param {Object} msg - Telegram message object passed in from tg.on() event below
*/
const resetHandler = (msg) => {
	let newConfig = "[]";
    aUsers = []
    console.log("Registered users reset")
    writeTelegramConfig (newConfig);
    msg.reply.text("User registry reset.")
}

/**
 * Handler function for /Delete or /Register <userid> Telegram events. Checks if user exists and then removes
 * them from the list of subscribed users if so.
 *  
 * @param {Object} msg - Telegram message object passed in from tg.on() event below
*/
const deleteHandler = (msg) => {

	let firstSpace = msg.text.indexOf(" ")

    //check if command is of the form /Delete or /Delete <user id>
	let deleteUserID = ((firstSpace >-1) ? msg.text.substring (firstSpace + 1) : msg.from.id) 
    let ptr = 0;
    found = false;
    //search current list of subscribed users to check that this user is actually subscribed
	for (userID of aUsers) {
		if (userID == deleteUserID) {
            aUsers.splice(ptr,1);
            found = true;
		}
		ptr+=1;
    }
    if(found){
        let newConfig = createTelegramString() //update String of resgistered users
        writeTelegramConfig (newConfig); //write to config file (store the contents of the new telegram user array string)
        
        if(msg.from.id != deleteUserID){ //if person A is deleting person B
            msg.reply.text("User deleted successfully")
            tg.sendMessage(deleteUserID, "You have been removed from the WBx JJ Bricks Gate Controller registry")
        }
        else{ //if person A is deleting themself
            msg.reply.text("You are no longer registered to the WBx JJ Bricks Gate Controller registry")
        }
    }
	
}

exports.sendMessage = (id, text) => {return tg.sendMessage(id, text)}; //expose Telebot sendMessage function to controller

const whoHandler = (msg) => {
    console.log(msg)
    msg.reply.text("BPS Bot: You are "+msg.from.first_name+" "+msg.from.last_name, {asReply: true})
}

let aUsers = readTelegramConfig(); //read in the list of subscribed users and store in this variable
exports.aUsers = aUsers; //make list of users available to the controller

console.log ("Current subscribed Telegram users:" + aUsers);

/**
 * Assign handler functions to each of the following Telegram commands (events) that
 * will be sent to the Telegram bot. In each case, a Telegram message object containing user, 
 * chat and other details is passed to the handler function
*/
tg.on (/\/Register/i, (newMsg) => registerHandler(newMsg))
tg.on (/\/Reset/i, (newMsg) => resetHandler(newMsg))
tg.on (/\/Delete/i, (newMsg) => deleteHandler(newMsg))
tg.on (/\/WhoAmI/i, (newMsg) => whoHandler(newMsg))

tg.start()