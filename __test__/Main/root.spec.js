const supertest = require("supertest");
const app = require("../../server");

describe("GET /", () => {
  it("should return 200 as status code", () => {
    return supertest(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
          status: "OK",
          data: null,
        });
      });
  });
});
