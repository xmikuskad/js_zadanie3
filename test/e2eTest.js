const chai = require('chai');
const chaiHttp = require('chai-http');
const mysql = require("mysql");
const app = require('../server.js')

chai.use(chaiHttp)
chai.should()

const AD_IMG = 'https://www.progamingshop.sk/sys_img/ui/logo_responsive.svg';
const HOST_ADDRESS = 'mydb';

var connection;

//Overovanie pripojenia k DB
describe('Database connection test',() => {
    before("Waiting for db to load",(done)=>{
        setTimeout(()=>{waiter(done)},2000);
    })

    //Pokus o pripojenie do DB, ak sa nepodari tak opakujeme kazdych 15 sec
    //Pri dockeri sa vacsinou neporadi na prvych par pokusov
    function waiter(done) {
        try {
            connection = mysql.createConnection({
                host: HOST_ADDRESS,
                user: 'root',
                password: 'root',
                database: 'js_db'
            });
            connection.connect();
            connection.query('SELECT 1', function (error, results, fields) {
                if (error) {
                    setTimeout(() => {
                        waiter(done)
                    }, 15000)
                } else {
                    done();
                }

            });

        } catch (err) {
            if (err) {
                setTimeout(() => {
                    waiter(done)
                }, 15000)
            }
        }
    }

    //Pre istotu som pripojenie na DB pridal aj ako test, ktory by mal vzdy prejst
    it('Attempt to connect to DB', function (done) {
        connection = mysql.createConnection({
            host: HOST_ADDRESS,
            user: 'root',
            password: 'root',
            database: 'js_db'
        });
        connection.connect(done);
    });
})

//Zaciatocne testy s pocitadlom a ziskanym linkom, nie su asi az tak podstatne
describe('Initial tests', () => {
    //Cakanie ak DB nie je vytvorena a treba naseedovat produkty
    before("Waiting 1s for load of db", (done) => {
        setTimeout(done, 1000);
    })

    //Overenie linku na reklamu
    it('Should get img link', done => {
        chai
            .request(app)
            .get('/getAdBanner')
            .end((error, response) => {
                if (response) {
                    response.body.img.should.equal(AD_IMG)
                    done()
                }
            })
    })

    let counterValue = 0;
    //Testovanie, ci inkrement pocitadla funguje tak ako ma
    it('Increment testing', done => {

        //Ziskanie aktualneho stavu pocitadla
        chai
            .request(app)
            .get('/getIncrement')
            .end((error, response) => {
                if (response) {
                    counterValue = response.body;

                    //Zvysenie pocitadla
                    chai
                        .request(app)
                        .get('/increment')
                        .end((error, response) => {
                            if (response) {

                                //Ziskanie stavu pocitadla po zvyseni
                                chai
                                    .request(app)
                                    .get('/getIncrement')
                                    .end((error, response) => {
                                        if (response) {
                                            response.body.should.equal(counterValue + 1)
                                            done()
                                        }
                                    })
                            }
                        })
                }
            })
        //Po teste musime vratit pocitadlo na povodnu hodnotu
        after('Zmena pocitadla na povodnu hodnotu po teste',done => {
            const query = 'UPDATE ad_counter SET count=? WHERE id=1';
            connection.query(query, [counterValue], function (error, results, fields) {
                if (error) throw error;
                done()
            });
        })
    })
})

//Testovanie procesu objednavky
describe('Order testing', () => {
    let order_id;
    let user_id;

    //Vytvorenie testovacich dat
    const user = {};
    user.name = "FerkoMrkvicka123";
    user.street = "NahodnaUlica";
    user.city = "Prievidza";
    user.street_num = 11;

    const price = 111;
    const products = [
        {
            id: 1,
            count: 2
        },
        {
            id: 2,
            count: 3
        },
        {
            id: 3,
            count: 4
        }
    ];

    //Testovanie komplet vytvorenia objednavky s produktami
    it('Order and user creation', done => {
        chai
            .request(app)
            .post('/createOrder')
            .set('content-type', 'application/json')
            .send(JSON.stringify({
                user:user,
                products:products,
                price:price
            }))
            .end((error, response) => {
                if (response) {
                    setTimeout(()=>{CheckResults(done)},100);
                }
            })
    })

    //Nastavenie objednavky ako zaplatenej a jej kontrola
    it('Set order as paid', done => {
        chai
            .request(app)
            .post('/payOrder')
            .set('content-type', 'application/json')
            .send(JSON.stringify({
                id:order_id
            }))
            .end((error, response) => {
                if (response) {
                    setTimeout(()=>{CheckIfPayed(done)},100);
                }
            })

        //Vymazanie pridanych dat po testovani
        after('Clearing data from test',done=>{
            ClearData(done);
        })
    })

    //Overenie, ci sa objednavka naozaj nastavila ako zaplatena
    function CheckIfPayed(done)
    {
        const query = 'SELECT * FROM orders WHERE order_id=?';
        connection.query(query,[order_id] ,function (error, results, fields) {
            if (error) throw error;
            results.length.should.equal(1);
            results[0].order_id.should.equal(order_id);
            results[0].state.should.equal(1);
            done()
        });
    }

    //Overenie pridania objednavky v DB
    function CheckResults(done) {
        //Overenie, ci pridalo pouzivatela
        const query = 'SELECT * FROM users WHERE name=?;';
        connection.query(query,[user.name], function (error, results, fields) {
            if (error) throw error;
            results.length.should.equal(1);
            results[0].name.should.equal(user.name);
            results[0].street.should.equal(user.street);
            results[0].city.should.equal(user.city);
            results[0].street_num.should.equal(user.street_num);
            user_id = results[0].id;

            //Overenie, ci pridalo objednavku
            const query2 = 'SELECT * FROM orders WHERE user_id=?;';
            connection.query(query2,[results[0].id], function (error2, results2, fields2) {
                if (error2) throw error;
                results2.length.should.equal(1);
                results2[0].user_id.should.equal(user_id);
                results2[0].price.should.equal(price);
                results2[0].state.should.equal(0);

                order_id = results2[0].order_id;

                //Overenie, ci pridalo produkty objednavky
                for(let i=0; i<products.length; i++)
                {
                    const query3 = 'SELECT * FROM orders_products WHERE order_id=? AND product_id=?; AND count=?';
                    connection.query(query3,[order_id,products[i].id,products[i].count], function (error3, results3, fields3) {
                        if (error2) throw error;
                        results2.length.should.equal(1);

                        if(i+1 === products.length)
                            done()
                    });
                }

            });

        });
    }

    //Vycistenie pridaneho pouzivatela, objednavky a produktov k objednavke
    function ClearData(done)
    {
        const query = 'DELETE FROM orders_products WHERE order_id = ?';
        connection.query(query,[order_id] ,function (error, results, fields) {
            if (error) throw error;
            const query = 'DELETE FROM orders WHERE order_id = ?';
            connection.query(query,[order_id] ,function (error, results, fields) {
                if (error) throw error;
                const query = 'DELETE FROM users WHERE id = ?';
                connection.query(query,[user_id] ,function (error, results, fields) {
                    if (error) throw error;
                    done()
                    connection.end();
                });
            });
        });
    }
})