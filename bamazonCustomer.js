var Table = require('cli-table')
var inquirer = require('inquirer')
var mysql = require('mysql')

var tableTemplate = {
    head: [
    'ID',
    'Product Name',
    'Department Name',
    'Quantity in Stock',
    'Price'],
    colWidths: [5, 30, 20, 20, 10],
  
}

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bamazon_db'
  });

function storeFront() {
    connection.connect(function (err) {
        if (err) throw ('Could not Connect to the Server. Please try again later\n\n', + err);
        console.log('Connected... \n\nWelcome to my humble shop. Please, take a look at our wares...\n');

        shopDisplay();
    })
}

function shopDisplay() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err)
            throw (err);
        var table = new Table(tableTemplate);
        for (x of res) {
            var tempArr = [
                x.item_id,
                x.product_name,
                x.department_name,
                x.stock_quantity,
                '$' + x.price
            ];
            table.push(tempArr);
        }
        console.log(table.toString());
        getWhat();
    });
}

function getWhat(){
    console.log('----------------------------------------------------------------------------------')
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the item ID that you would like to purchase: ',
            name: 'qID',
        },
        {
            type: 'input',
            message: 'How many units would you like to purchase?',
            name: 'quantity',
        }
    ]).then(function(response){
        var IDpass = response.qID
        var qPass = response.quantity
        
        getData(IDpass, qPass)

        
    })
}

function getData(id, quantity) {

        connection.query("SELECT * FROM products WHERE item_id=?", [id], function(err,res){
            if (err) throw(err)
            var purchaseObj = res[0]
            console.log(`\n\nYou are trying to purchase the ` + purchaseObj.product_name + `...` )
            checkAndUpdate(purchaseObj, quantity)
        })
    }

function checkAndUpdate(obj, userAmount){
    if (userAmount < obj.stock_quantity){
        console.log('\nThere is enough in stock!')
        updateDB(obj,userAmount)
    }else if (userAmount > obj.stock_quantity){
        console.log("Sorry. That purchase is too large for what we have in stock...")
        continueQuery()
    }
}

function updateDB(obj, amount){
    var updateAmount = obj.stock_quantity - amount
 
    console.log('\nProcessing purchase...')
    connection.query('UPDATE products SET ? WHERE ? ',
    [
        {stock_quantity: updateAmount},
        {item_id: obj.item_id}
    ], function(err, res){
        if (err) throw (err)
        console.log('\n\n----------------------------------------------------------------------------------')
        console.log(`PURCHASE COMPLETE!\n
        ${res.affectedRows} product amount/s updated!\n
        There are ${updateAmount} products remaining in stock....`)
    console.log('----------------------------------------------------------------------------------')
    
    continueQuery()
    })
}

function continueQuery(){
    
    inquirer.prompt([
        {
            type:'confirm',
            message: 'Would you like to continue shopping?',
            name:'continue',
        }
    ]).then(function(a){
        if (a.continue){
            console.log('\n\n\n')
            shopDisplay()
        }else{
            connection.end()
            console.log('\n\n\n GOOD BYE.')
        }
    })
}

storeFront()
