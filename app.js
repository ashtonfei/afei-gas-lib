/**
 * Get all items from a sheet of the spreadsheet
 * 
 * @param {string} sheetName
 * @param {string} spreadsheetId
 * @return {array} an array of objects or null
 */
function getItemsFromSheet(sheetName, spreadsheetId) {
    return new SheetApp(spreadsheetId).getItems(sheetName)
}

/**
 * Add a new item (row) to the spreadsheet
 * 
 * @param {object} item object
 * @param {string} sheetName
 * @param {string} spreadsheetId
 * @return {object} new item object created
 */
function createItemInSheet(item, sheetName, spreadsheetId) {
    return new SheetApp(spreadsheetId).createItem(item, sheetName)
}

/**
 * delete a new item (row) from the spreadsheet
 * 
 * @param {object} item object
 * @param {string} sheetName
 * @param {string} spreadsheetId
 * @return {object} item object updated
 */
function updateItemInSheet(item, sheetName, spreadsheetId) {
    return new SheetApp(spreadsheetId).updateItem(item, sheetName)
}

/**
 * delete a new item (row) from the spreadsheet
 * 
 * @param {object} item object
 * @param {string} sheetName
 * @param {string} spreadsheetId
 * @return {object} item object deleted
 */
function deleteItemFromSheet(item, sheetName, spreadsheetId) {
    return new SheetApp(spreadsheetId).deleteItem(item, sheetName)
}
