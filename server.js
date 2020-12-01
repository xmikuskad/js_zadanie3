//Popis produktov, ceny a obrazky boli vsetky prebrate zo stranky https://www.progamingshop.sk/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

const HOST_ADDRESS = 'localhost';//pouzit 'mydb' pri dockeri
const DB_NAME = "js_db";
//const AD_IMG = 'http://qnimate.com/wp-content/uploads/2014/03/images2.jpg';
const AD_IMG = 'https://www.progamingshop.sk/sys_img/ui/logo_responsive.svg';
const port = 8080;

const DB_CONFIG = {
    host     : HOST_ADDRESS,
    user     : 'root',
    password : 'root'
};

var connection = mysql.createConnection(DB_CONFIG);

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/data',(req,res)=>{
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/getOrders',(req,res)=>{
    connection.query('SELECT * FROM orders JOIN users ON orders.user_id = users.id', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/getIncrement',(req,res)=>{
    var query = 'SELECT count FROM ad_counter WHERE id=1';
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.json(results[0].count)
    });
});

app.get('/increment',(req,res)=>{
    incrementCounter();
    res.end();
});

app.get('/getAdBanner',(req,res)=>{
    res.json({
        img:AD_IMG
    });
});

//POST metody
app.post('/payOrder',(req,res)=>{
    setOrderAsPaid(req.body.id)
    res.end();
});

app.post('/createOrder',(req,res)=>{

    checkUserAndCreateOrder(req.body.user,req.body.products,req.body.price)
    res.end();
});

function setOrderAsPaid(order_id)
{
    var query = 'UPDATE orders SET state=1 WHERE order_id=?';
    connection.query(query,[order_id], function (error, results, fields) {
        if (error) throw error;
    });
}

function checkUserAndCreateOrder(user,products,price)
{
    var query = 'SELECT * FROM users WHERE name=?;';
    connection.query(query,[user.name], function (error, results, fields) {
        if (error) throw error;
        if(results.length <= 0) {
            //insert user
            var query = 'INSERT INTO users(name,street,city,street_num) VALUES (?,?,?,?);';
            connection.query(query, [user.name, user.street, user.city, user.street_num], function (error, results, fields) {
                if (error) throw error;
                createOrder(products,price,results.insertId);
            });
        }
        else
        {
            createOrder(products,price,results[0].id);
        }
    });
}

function createOrder(products,price,userId)
{
    //create order
    var query2 = 'INSERT INTO orders(user_id,price,state) VALUES (?,?,?);';
    connection.query(query2, [userId, price, 0], function (error, results, fields) {
        if (error) throw error;
        var orderId = results.insertId;


        for (let i = 0; i < products.length; i++) {
            var query3 = 'INSERT INTO orders_products(order_id,product_id,count) VALUES (?,?,?);';
            connection.query(query3, [orderId, products[i].id, products[i].count], function (error, results, fields) {
                if (error) throw error;
            });
        }

    });
}

function addProduct(variables)
{
    var query = 'INSERT INTO products (name, image, price, description)\n' +
        'VALUES (?,?,?,?);';
    connection.query(query,variables, function (error, results, fields) {
        if (error) throw error;
    });
}

function incrementCounter()
{
    var query = 'UPDATE ad_counter SET count=count+1 WHERE id=1';
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
    });
}

function seedProducts() {
    //Nacitanie pocitadla
    var query = 'INSERT INTO ad_counter (count)\n' +
        'VALUES (0);';
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
    });

    //Zdroj informacii: https://www.progamingshop.sk
    addProduct(["LEGO Marvel Super Heroes [XBOX 360]", "https://www.progamingshop.sk/images/data/product/lego-marvel-super-heroes-xbox-360-218463.jpg", "16.99",
        "Marvelovský super-hrdinovia sa združujú, aby Vám poskytli nabitú lego-kocky rozbíjajúcu akciu! LEGO Marvel Super Heroes je prvá hra v úspešnej sérii LEGO, " +
        "ktorá obsahuje slávne Marvel postavy!"]);
    addProduct(['FIFA 14 CZ [XBOX 360]', 'https://www.progamingshop.sk/images/data/product/fifa-14-cz-xbox-360-211825.jpg', '17.99',
        'Vďaka inováciám mnohonásobne oceneného herného systému Vás FIFA 14 vtiahne do diania a atmosféry okolo futbalového zápasu.']);
    addProduct(["Red Dead Redemption [XBOX 360]", "https://www.progamingshop.sk/images/data/product/red-dead-redemption-xbox-360-39568.jpg", "14.99",
        "Hra od známych tvorcov GTA sa odohráva na divokom západe, kde banda vyhnancov a kriminálnikov určuje vládou teroru tvrdé pravidlá"]);
    addProduct(['Rayman Legends [XBOX 360]', 'https://www.progamingshop.sk/images/data/product/rayman-legends-xbox-360-212369.jpg', '17.99',
        'Rayman, plošinovka roka a víťaz mnohých umeleckých a hudobných ocenení, prichádza s úplne novým dobrodružstvom.']);
    addProduct(['Zaklínač 2: Vrahovia kráľov CZ (Rozšírená edícia) [XBOX 360]', 'https://www.progamingshop.sk/images/data/product/zaklinac-2-vrahovia-kralov-cz-rozsirena-edicia-xbox-360-203568.jpg',
        '19.99', 'Druhý diel ságy o Zaklínačovi Geraltovi z Rivie predstavuje strhujúci a premyslený príbeh, ktorý definuje nové štandardy pre hry s nelineárnym dejom.']);
    addProduct(['Diablo 3 [XBOX 360]', 'https://www.progamingshop.sk/images/data/product/diablo-3-xbox-360-217116.jpg', '14.99',
        'Absolútna RPG legenda prichádza po prvýkrát do sveta herných konzol! Kompletne redizajnovaná, aby poskytla dokonalý pôžitok aj bez použitia klávesnice a myši - ' +
        'Diablo III Vám poskytne herný zážitok, ako žiadna iná hra.']);
}

function createDB() {
    const db_create_string = [];

    db_create_string[0] = "DROP DATABASE IF EXISTS "+DB_NAME+";";
    db_create_string[1] = "CREATE DATABASE IF NOT EXISTS "+DB_NAME+";";
    db_create_string[2] = "USE "+DB_NAME+";";

    db_create_string[3] = "DROP TABLE IF EXISTS `users`;";
    db_create_string[4] =
        "CREATE TABLE `users` (" +
        "  `id` int NOT NULL AUTO_INCREMENT," +
        "  `name` varchar(100) NOT NULL," +
        "  `street` varchar(255) NOT NULL," +
        "  `city` varchar(100) NOT NULL," +
        "  `street_num` int NOT NULL," +
        "  PRIMARY KEY (`id`)," +
        "  UNIQUE KEY `name_UNIQUE` (`name`)" +
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";

    db_create_string[5] = "DROP TABLE IF EXISTS `orders`;";

    db_create_string[6] = "CREATE TABLE `orders` (" +
        "  `order_id` int NOT NULL AUTO_INCREMENT," +
        "  `user_id` int DEFAULT NULL," +
        "  `price` float NOT NULL," +
        "  `state` int DEFAULT NULL," +
        "  PRIMARY KEY (`order_id`)," +
        "  KEY `user_id_idx` (`user_id`)" +
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";

    db_create_string[7] = "DROP TABLE IF EXISTS `products`;";
    db_create_string[8] = "CREATE TABLE `products` (" +
        "  `id` int NOT NULL AUTO_INCREMENT," +
        "  `name` varchar(100) NOT NULL," +
        "  `image` varchar(255) NOT NULL," +
        "  `price` float NOT NULL," +
        "  `description` varchar(255) NOT NULL," +
        "  PRIMARY KEY (`id`)" +
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";

    db_create_string[9] = "DROP TABLE IF EXISTS `orders_products`;";
    db_create_string[10] =
        "CREATE TABLE `orders_products` (" +
        "  `id` int NOT NULL AUTO_INCREMENT," +
        "  `order_id` int DEFAULT NULL," +
        "  `product_id` int DEFAULT NULL," +
        "  `count` int NOT NULL," +
        "  PRIMARY KEY (`id`)," +
        "  KEY `order_id_idx` (`order_id`)," +
        "  KEY `product_id_idx` (`product_id`)," +
        "  CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)," +
        "  CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)" +
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";

    db_create_string[11] = "DROP TABLE IF EXISTS `ad_counter`;";
    db_create_string[12] =
        "CREATE TABLE `ad_counter` (" +
        "  `id` int NOT NULL AUTO_INCREMENT," +
        "  `count` int NOT NULL," +
        "  PRIMARY KEY (`id`)" +
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";


    loadQueryWithWaiting(0,db_create_string);
}

//Aby som zarucil, ze sa najskor vytvoria tabulky a az potom sa do nich nacitaju udaje
function loadQueryWithWaiting(i,db_create_string)
{
    if(i >= db_create_string.length)
    {
        connection.end();
        //Pripojenie na spravnu db
        connection = mysql.createConnection({
            host: HOST_ADDRESS,
            user: 'root',
            password: 'root',
            database: DB_NAME
        });
        seedProducts();
    }
    else {
        connection.query(db_create_string[i], function (error, results, fields) {
            if (error) throw error;
            console.log('Initializing table ' + (i + 1) + "/" + db_create_string.length);
            loadQueryWithWaiting(i+1,db_create_string);
        });
    }
}

function checkDBStatus() {
    connection.query('SHOW DATABASES;', function (error, results, fields) {
        var found = false;

        if(results === undefined)
            throw SQLException;

        for (var i = 0; i < results.length; i++) {
            if (results[i].Database === DB_NAME) {
                found = true;
                break;
            }
        }

        if (!found) {
            console.log("Creating database")
            createDB();
        } else {
            console.log('Database already created');

            connection.end();
            connection = mysql.createConnection({
                host: HOST_ADDRESS,
                user: 'root',
                password: 'root',
                database: DB_NAME
            });

            var user = {};
            user.name='Fero';
            user.street="Kosovska";
            user.city="Prievidza";
            user.street_num = 10;

            var products = [[1,2],[2,1]];

            //createOrder(user,products,100);

            //setOrderAsPaid(1);
        }

    });
}

const attemptToConnect = function(callBack)
{
    connection = mysql.createConnection(DB_CONFIG);
    connection.connect(err=>{
        if(err)
        {
            console.error(err);
            connection.end(err=>{
                console.error('CLOSE ERROR!')
            })
            setTimeout(()=>{
                attemptToConnect(callBack)
            },15000)
        }
        else {
            callBack();
        }
    })
}

attemptToConnect(()=>{
    app.listen(port,()=>{
        console.log('Connected to db, started listening');
        checkDBStatus();
    });
})

module.exports = app;
