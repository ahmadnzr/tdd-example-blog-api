const supertest = require("supertest");
const app = require("../../server");
const { User } = require("../../models");

describe("POST /v1/register", () => {
  beforeAll(() => {
    return User.create({
      email: "ahmad@exists.com",
      encryptedPassword: "laskjdlaksjdl12093u1029830912lkjsalkdasjd9802",
    });
  });

  afterAll(() => {
    return User.destroy({
      where: {
        email: [
          "ahmad@exists.com",
          "ahmad@notexists.com",
        ],
      },
    });
  });

  it("should return 201 as status code", async () => {
    const response = await supertest(app).post("/v1/register").send({
      email: "ahmad@notexists.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      status: "OK",
      data: expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresAt: expect.any(Number),
      }),
    });
  });

  it("should return 422 as status code when email already taken", async () => {
    const response = await supertest(app).post("/v1/register").send({
      email: "ahmad@exists.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(422);
    expect(response.body).toEqual({
      status: "FAIL",
      data: expect.objectContaining({
        name: "FAILED_TO_REGISTER",
        message: "Email already exists!",
      }),
    });
  });
});
