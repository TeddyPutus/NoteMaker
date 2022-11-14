const app = require("../server.js");
const seed = require("../seed.js");
const request = require("supertest");
const {db} = require('../db')

beforeAll(async () => {
    await seed();
})

/**--------------------- */
/** Testing User Routes */
/**--------------------- */
describe("Testing User routes", () => {
    describe("Create a user", () => {
        describe("With valid values", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await (await request(app).post("/users/create")).send({  email:"teddyputus1@gmail.com", password:"thisisapassword", username:"Tedernator" });
                expect(statusCode).toBe(200);
            })
            it("User exists in the database", async () => {
                const user = await User.findOne({where:{email: "teddyputus1@gmail.com"}})
                expect(user.username).toBe("Tedernator")
            })
        })
        describe("With invalid values, returns 400", () => {
            it("Returns 400 when username not unique", async () => {
                const { statusCode } = await request(app).post("/users/create").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Tedernator" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 when username has spaces", async () => {
                const { statusCode } = await request(app).post("/users/create").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Teder nator2" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 when username not alphanumeric", async () => {
                const { statusCode } = await request(app).post("/users/create").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Teder-nator2!" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 when email not unique", async () => {
                const { statusCode } = await request(app).post("/users/create").send({  email:"teddyputus1@gmail.com", password:"thisisapassword", username:"Tedernator2" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 when email not an email address", async () => {
                const { statusCode } = await request(app).post("/users/create").send({  email:"teddyputus1.com", password:"thisisapassword", username:"Tedernator2" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 when password too short", async () => {
                const { statusCode } = await request(app).post("/users/create").send({  email:"teddyputus2.com", password:"short", username:"Tedernator2" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 when password has spaces", async () => {
                const { statusCode } = await request(app).post("/users/create").send({  email:"teddyputus2.com", password:"short pass", username:"Tedernator2" });
                expect(statusCode).toBe(400);
            })
        }) 
    })
    describe("Log user in", () => {
        describe("With a valid user", () => {
            it("returns 200 status and the logged in user", async () => {
                const {statusCode, body} = await request(app).post("/users/login").send({  email:"teddyputus1@gmail.com", password:"thisisapassword"});
                expect(statusCode).toBe(200);
                expect(body.username).toBe("Tedernator");
            })
            it("isLoggedIn is now set to true in the database", async () => {
                const user = await User.findOne({where:{username:"Tedernator"}});
                expect(user.isLoggedIn).toBe(true);
            })
        })

        describe("With an invalid user", () => {
            it("returns 401 status if password is incorrect", async () => {
                await User.create({  email:"teddyputus2@gmail.com", password:"password", username:"Tedworth"})
                const {statusCode, body} = await request(app).post("/users/login").send({  email:"teddyputus2@gmail.com", password:"wrongpass"});
                expect(statusCode).toBe(401);
            })
            it("returns 404 status if user doesn't exist", async () => {
                const {statusCode, body} = await request(app).post("/users/login").send({  email:"teddyputus69@gmail.com", password:"thisisapassword"});
                expect(statusCode).toBe(404);
            })
            it("returns 406 status if user already logged in", async () => {
                const {statusCode, body} = await request(app).post("/users/login").send({  email:"teddyputus1@gmail.com", password:"thisisapassword"});
                expect(statusCode).toBe(406);
            })
            
        })
    })

    describe("Log user out", () => {
        describe("With a valid and logged in user", () => {
            it("returns 200 status", async () => {
                const {statusCode} = await request(app).post("/users/logout").send({  email:"teddyputus1@gmail.com", password:"thisisapassword"});
                expect(statusCode).toBe(200);
            })
            it("isLoggedIn is now set to false in the database", async () => {
                const user = await User.findOne({where:{username:"Tedernator"}});
                expect(user.isLoggedIn).toBe(false);
            })
        })

        describe("With an invalid user", () => {
            it("returns 401 status if password is incorrect", async () => {
                await User.update({isLoggedIn : true}, {where:{  email:"teddyputus2@gmail.com"}})
                const {statusCode, body} = await request(app).post("/users/login").send({  email:"teddyputus2@gmail.com", password:"wrongpass"});
                expect(statusCode).toBe(401);
            })
            it("returns 404 status if user doesn't exist", async () => {
                const {statusCode, body} = await request(app).post("/users/login").send({  email:"teddyputus69@gmail.com", password:"thisisapassword"});
                expect(statusCode).toBe(404);
            })
            it("returns 406 status if user already logged out", async () => {
                const {statusCode, body} = await request(app).post("/users/login").send({  email:"teddyputus1@gmail.com", password:"thisisapassword"});
                expect(statusCode).toBe(406);
            })
            
        })
    })
    
    describe("Deletet", () => {
        describe("With a valid user", () => {
            it("returns 200 status", async () => {
                const {statusCode} = await request(app).delete("/users/delete").send({  email:"teddyputus1@gmail.com", password:"thisisapassword", username: "Tedernator"});
                expect(statusCode).toBe(200);
            })
            it("user no longer in the database", async () => {
                const user = await User.findOne({where:{username:"Tedernator"}});
                expect(user).toBe(null);
            })
        })

        describe("With an invalid user", () => {
            it("returns 401 status if password is incorrect", async () => {
                await User.update({isLoggedIn : true}, {where:{  email:"teddyputus2@gmail.com"}})
                const {statusCode, body} = await request(app).delete("/users/delete").send({  email:"teddyputus2@gmail.com", password:"wrongpass", username: "Tedworth"});
                expect(statusCode).toBe(401);
            })
            it("returns 404 status if user doesn't exist", async () => {
                const {statusCode, body} = await request(app).delete("/users/delete").send({  email:"teddyputus1@gmail.com", password:"thisisapassword", username: "Tedernator"});
                expect(statusCode).toBe(404);
            })
        })
    })  
})

    

/**--------------------- */
/** Testing Post Routes */
/**--------------------- */
