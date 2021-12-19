const { doRegister } = require("./auth.controller");

describe("authController.doRegister", () => {
  it("should call res.status with 201 and call json with given schema", async () => {
    const request = jest.fn();
    const response = jest.fn();
    const MockUser = jest.fn();
    const mockUser = new MockUser();

    mockUser.id = "3fbf105c-c9e1-478e-b29d-d2c812589a46";
    mockUser.email = "ahmad@notexists.com";
    mockUser.encryptedPassword = "laksjdlakjsldkjaslkdjlqkwjeiqowe";
    mockUser.createdAt = new Date();
    mockUser.updatedAt = new Date();

    request.body = {
        email: "ahmad@notexists.com",
        password: "123456"
    }

    response.status = jest.fn(() => response);
    response.json = jest.fn(() => response);

    MockUser.findOne = jest.fn(async () => null);
    MockUser.create = jest.fn(() => mockUser);

    await doRegister(MockUser)(request, response);

    expect(MockUser.findOne).toHaveBeenCalledWith({
      where: {
        email: "ahmad@notexists.com",
      },
    });

    expect(MockUser.create).toHaveBeenCalledWith({
      email: "ahmad@notexists.com",
      encryptedPassword: expect.any(String),
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      status: "OK",
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresAt: expect.any(Number),
      },
    });
  });

  it("should call res.status with 422 and call json with given schema", async () => {
    const request = jest.fn();
    const response = jest.fn();
    const MockUser = jest.fn();
    const mockUser = new MockUser();

    mockUser.id = "3fbf105c-c9e1-478e-b29d-d2c812589a46";
    mockUser.email = "ahmad@exists.com";
    mockUser.encryptedPassword = "laksjdlakjsldkjaslkdjlqkwjeiqowe";
    mockUser.createdAt = new Date();
    mockUser.updatedAt = new Date();

    request.body = {
        email: "ahmad@exists.com",
        password: "123456"
    }

    response.status = jest.fn(() => response);
    response.json = jest.fn(() => response);

    MockUser.findOne = jest.fn(async () => mockUser);
    MockUser.create = jest.fn(() => mockUser);

    await doRegister(MockUser)(request, response);

    expect(MockUser.findOne).toHaveBeenCalledWith({
      where: {
        email: "ahmad@exists.com",
      },
    });

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith({
      status: "FAIL",
      data: {
        name: "FAILED_TO_REGISTER",
        message: "Email already exists!",
      },
    });
  });
});
