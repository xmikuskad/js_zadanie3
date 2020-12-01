// Import the dependencies
var chai = require('chai')
var chaiHttp = require('chai-http')
const mysql = require("mysql");
//import app from '../server.js'
const app = require('../server.js')
// Configure Chai
chai.use(chaiHttp)
chai.should()

//const AD_IMG = 'http://qnimate.com/wp-content/uploads/2014/03/images2.jpg';
const AD_IMG = 'https://www.progamingshop.sk/sys_img/ui/logo_responsive.svg';
const API = 'http://localhost:8080'

var connection;

describe('IS DB UP?',() => {
    before("Waiting 1,5 seconds for load of db",(done)=>{
        setTimeout(done,1500);
    })
    it('Attempt to connect to DB', function (done) {
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'js_db'
        });
        connection.connect(done);
    });
})

describe('Moj test 1', () => {
    it('should show img link', done => {
        chai
            .request(app)
            .get('/getAdBanner')
            .end((error, response) => {
                if(response) {
                    response.body.img.should.equal(AD_IMG)
                }
                done()
            })
    })
})