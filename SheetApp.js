class SheetApp {
    /**
     * 
     * @param {string} spreadsheetId 
     */
    constructor(spreadsheetId) {
        this.headerId = "id"
        this.headerCreatedOn = "createdOn"
        this.headerModifiedOn = "modifiedOn"

        this.ss = SpreadsheetApp.openById(spreadsheetId)
    }

    /**
     * create an id for the new item
     * 
     * @return {string} an new id for the new item
     */
    createId() {
        return Utilities.getUuid()
    }

    /**
     * get the keys from row 1 and values for the rest rows
     * 
     * @param {sheet} sheet
     * @return {object} an object with keys and values
     */
    getKeysAndValues(ws) {
        const [keys, ...values] = ws.getDataRange().getValues()
        keys.forEach((key, i) => keys[i] = key.toString().trim())
        return { keys, values }
    }

    /**
     * check item and sheet name
     * 
     * @param {object} item 
     * @param {string} sheetName 
     * @return {object} item id and sheet
     */
    checkItemAndSheet(item, sheetName) {
        if (Object.prototype.toString.call(item) !== "[object Object]") return
        const id = item[this.headerId]
        const ws = this.ss.getSheetByName(sheetName)
        if (!ws) return
        return { id, ws }
    }

    /**
     * 
     * @param {string} sheetName 
     * @return {array} a list of objects
     */
    getItems(sheetName) {
        const ws = this.ss.getSheetByName(sheetName)
        if (!ws) return
        const { keys, values } = this.getKeysAndValues(ws)
        return values.map(v => {
            const item = {}
            keys.forEach((key, i) => item[key] = v[i])
            return item
        })
    }

    /**
     * 
     * @param {string} id 
     * @param {sheetName} sheetName 
     */
    getItemById(id, sheetName) {
        const items = this.getItems(sheetName)
        if (!items) return
        return items.find(item => item[this.headerId] === id)
    }

    /**
     * 
     * @param {object} item 
     * @param {string} sheetName 
     * @return {object} the new item object created or null
     */
    createItem(item, sheetName) {
        const isValid = this.checkItemAndSheet(item, sheetName)
        if (!isValid) return
        const { id, ws } = isValid
        if (id === undefined) item[this.headerId] = this.createId()
        if (item[this.headerCreatedOn] === undefined) item[this.headerCreatedOn] = new Date()
        const { keys } = this.getKeysAndValues(ws)
        const newItem = {}
        const rowContents = keys.map(key => {
            const value = item[key] != undefined ? item[key] : ''
            newItem[key] = value
            return value
        })
        ws.appendRow(rowContents)
        return newItem
    }

    /**
     * 
     * @param {object} item 
     * @param {string} sheetName 
     * @return {object} the item object updated or null
     */
    updateItem(item, sheetName) {
        const isValid = this.checkItemAndSheet(item, sheetName)
        if (!isValid) return
        const { id, ws } = isValid
        if (id === undefined) return

        const { keys, values } = this.getKeysAndValues(ws)
        const indexId = keys.indexOf(this.headerId)
        if (indexId === -1) return
        const findRow = values.findIndex(v => v[indexId] === id)
        if (findRow === -1) return
        item[this.headerModifiedOn] = new Date()
        const updatedItem = {}
        keys.forEach((key, index) => {
            const value = item[key]
            if (value !== undefined) {
                ws.getRange(findRow + 2, index + 1).setValue(value)
                updatedItem[key] = value
            } else {
                updatedItem[key] = ws.getRange(findRow + 2, index + 1).getValue()
            }
        })
        return updatedItem
    }

    /**
     * 
     * @param {object} item 
     * @param {string} sheetName 
     * @return {object} the item object deleted or null
     */
    deleteItem(item, sheetName) {
        const isValid = this.checkItemAndSheet(item, sheetName)
        if (!isValid) return
        const { id, ws } = isValid
        if (id === undefined) return
        const { keys, values } = this.getKeysAndValues(ws)
        const indexId = keys.indexOf(this.headerId)
        if (indexId === -1) return
        const findRow = values.findIndex(v => v[indexId] === id)
        if (findRow === -1) return
        ws.deleteRow(findRow + 2)
        return item
    }
}
